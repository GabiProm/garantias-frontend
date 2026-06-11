import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function CasosMesChart({ data }) {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="2025" stroke="#3b82f6" />
      <Line type="monotone" dataKey="2026" stroke="#ef4444" />
    </LineChart>
  );
}