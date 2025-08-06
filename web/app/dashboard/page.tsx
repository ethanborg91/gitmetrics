import { EventMetrics } from '../../types/types';
import { CommitChart } from '../../components/CommitChart';
import { StatCard } from '../../components/StatCard';
import Cookies from 'js-cookie';

export default async function Dashboard() {
  const token = Cookies.get('authToken');
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summary`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` }, // JWT bearer—stateless auth pattern
  });

  if (!res.ok) {
    return <p className="text-red-600">API error</p>;
  }

  const data: EventMetrics = await res.json();

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
