import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

export default function GarantiaChart({ data }) {
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}