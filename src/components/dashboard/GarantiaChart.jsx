import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#10b981", "#ef4444"];

export default function GarantiaChart({ data }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="flex items-center justify-center gap-10">

      <PieChart width={320} height={260}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          innerRadius={50}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />

        {/* 🔥 KPI CENTRAL */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={16}
          fontWeight="bold"
          fill="#111"
        >
          {total}
        </text>

      </PieChart>

      <div className="space-y-3">
        {data.map((item, index) => {
          const porcentaje = ((item.value / total) * 100).toFixed(1);

          return (
            <div key={index} className="flex items-center gap-2">

              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />

              <div>
                <span className="text-sm font-semibold text-gray-800">
                  {item.name}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {item.value} ({porcentaje}%)
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}