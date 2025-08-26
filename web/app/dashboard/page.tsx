'use client';

import { useState, useEffect } from 'react';
import { EventMetrics } from '../../types/types';
import { CommitChart } from '../../components/CommitChart';
import { StatCard } from '../../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [data, setData] = useState<EventMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [cliToken, setCliToken] = useState('');
  const [command, setCommand] = useState('');
  const serverUrl = process.env.NEXT_PUBLIC_API_URL;

  const getClientToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    const raw = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1];
    return raw ? decodeURIComponent(raw) : null;
  };

  useEffect(() => {
    if (authLoading) return;
    console.log(user);
    if (!user) {
      router.push('/login'); // Guard: Redirect if unauth
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const clientToken = getClientToken();
        let response: Response;
        if (clientToken) {
          // Avoid race on first load by calling backend directly with Authorization
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/summary`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${clientToken}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          });
        } else {
          response = await fetch('/api/events/summary', {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
          });
        }

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const eventData = await response.json();
        setData(eventData);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  const generateCliToken = async () => {
    setCliToken('');
    setCommand('');
    try {
      const clientToken = getClientToken(); // Keep your existing function
      if (!clientToken) throw new Error('No auth token found');

      const response = await fetch('/api/auth/generate-cli-token', {
        // Proxy via /api
        method: 'GET',
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to generate token`);

      const tokenData = await response.json();
      setCliToken(tokenData.access_token);
      setCommand(
        `go install github.com/ethanborg91/gitmetrics/cli@latest && cli init ${tokenData.access_token} --server-url ${serverUrl}`,
      );
    } catch (err: any) {
      console.error('Failed to generate CLI token:', err);
      alert(err.message || 'Error generating token');
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(command).then(() => alert('Command copied to clipboard!'));
  };

  if (authLoading) return <p>Loading...</p>;
  if (!user) return null;
  if (error) return <p className="text-red-600">{error}</p>;
  if (loading || !data) return <p>Loading data...</p>;

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">GitMetrics dashboard</h1>
      <section className="grid grid-cols-3 gap-6">
        <StatCard label="Total commits" value={data.total_commits} />
        <StatCard label="Repos tracked" value={data.repos} />
      </section>
      <div className="mt-8">
        <CommitChart commitsByDay={data.commits_by_day} />
      </div>

      {/* New CLI Setup Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">CLI Setup</h2>
        <p>Generate a token to link your CLI for auto-submissions.</p>
        <button
          onClick={generateCliToken}
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Generate CLI Token
        </button>
        {command && (
          <div className="mt-4">
            <p>Copy and run this command in your terminal:</p>
            <div className="block overflow-x-auto rounded bg-gray-200 p-2 text-gray-500">
              {command}
            </div>
            <button
              onClick={copyCommand}
              className="mt-2 cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Copy Command
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
