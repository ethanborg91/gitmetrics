import { EventMetrics } from './types';
import { CommitChart } from '@/components/CommitChart';
import { StatCard } from '@/components/StatCard';

export default async function Dashboard() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/summary`,
    { cache: 'no-store' }    
  );

  if (!res.ok) {
    return <p className="text-red-600">API error</p>;
  }

  const data: EventMetrics = await res.json();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">GitMetrics dashboard</h1>

      <section className="grid grid-cols-2 gap-6">
        <StatCard label="Total commits" value={data.total_commits} />
        <StatCard label="Repos tracked" value={data.repos} />
        {/* add more cards as you extend /summary */}
      </section>

      <CommitChart commitsByDay={data.commits_by_day} />
    </main>
  );
}
