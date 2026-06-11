import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function CasosTrimestreChart({ data }) {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="trimestre" />
      <YAxis />
      <Tooltip />
      <Legend />

      {/* ✅ Igual que mes, pero con trimestres */}
      <Line type="monotone" dataKey="2025" stroke="#3b82f6" />
      <Line type="monotone" dataKey="2026" stroke="#ef4444" />
    </LineChart>
  );
}
