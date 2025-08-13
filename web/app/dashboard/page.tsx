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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      console.log(user);
      router.push('/login'); // Guard: Redirect if unauth
      return;
    }
    const fetchData = async () => {
      try {
        // Service handles auth header
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      }
    };
    fetchData();
  }, [user, authLoading, router]);

  if (authLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Loading data...</p>;

  return (
    <main className="mx-auto min-h-screen max-w-4xl bg-gray-50 p-8">
      <h1 className="text-2xl font-bold">GitMetrics dashboard</h1>
      <section className="grid grid-cols-3 gap-6">
        <StatCard label="Total commits" value={data.total_commits} />
        <StatCard label="Repos tracked" value={data.repos} />
      </section>
      <CommitChart commitsByDay={data.commits_by_day} />
    </main>
  );
}
