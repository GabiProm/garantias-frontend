import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function TipoDanoChart({ data }) {
  return (
    <BarChart width={400} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#3b82f6" />
    </BarChart>
  );
}