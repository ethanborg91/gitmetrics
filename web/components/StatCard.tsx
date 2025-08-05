export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
