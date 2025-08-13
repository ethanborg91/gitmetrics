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

  useEffect(() => {
    if (authLoading) return;
    console.log(user)
    if (!user) {
      router.push('/login'); // Guard: Redirect if unauth
      return;
    }

    const fetchData = async () => {
      const getClientToken = (): string | null => {
        if (typeof document === 'undefined') return null;
        const raw = document.cookie
          .split('; ')
          .find((row) => row.startsWith('authToken='))
          ?.split('=')[1];
        return raw ? decodeURIComponent(raw) : null;
      };

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

  if (authLoading) return <p>Loading...</p>;
  if (!user) return null;
  if (error) return <p className="text-red-600">{error}</p>;
  if (loading || !data) return <p>Loading data...</p>;

  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-gray-50 p-8">
      <h1 className="mb-6 text-2xl font-bold">GitMetrics dashboard</h1>
      <section className="grid grid-cols-3 gap-6">
        <StatCard label="Total commits" value={data.total_commits} />
        <StatCard label="Repos tracked" value={data.repos} />
      </section>
      <div className="mt-8">
        <CommitChart commitsByDay={data.commits_by_day} />
      </div>
    </main>
  );
}
