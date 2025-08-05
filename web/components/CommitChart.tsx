'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from "recharts";

export function CommitChart({ commitsByDay }:{
  commitsByDay: { date: string; count: number }[];
}) {
  return (
    <LineChart width={600} height={300} data={commitsByDay}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="count" strokeWidth={2} />
    </LineChart>
  );
}
