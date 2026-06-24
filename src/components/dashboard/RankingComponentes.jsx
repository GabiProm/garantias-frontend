
import {
  BarChart,  XAxis, Bar,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";


export default function RankingComponentes({ data }) {

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6"
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <h3 className="text-sm font-semibold mb-3">
        Ranking de Componentes
      </h3>

      <ResponsiveContainer width="100%" height={data.length * 40}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
        >

          {/* ✅ EJE X (valores numéricos) */}
          <XAxis type="number" />

          {/* ✅ EJE Y (nombres de componentes) */}
          <YAxis
            dataKey="name"
            type="category"
            width={160}
            tick={{ fontSize: 12 }}
          />

          {/* ✅ TOOLTIP */}
          <Tooltip />

          {/* ✅ BARRAS */}
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="value" position="insideTop" fill="#ffffff" style={{ fontWeight: "bold" }} formatter={(value) => (value === 0 ? "0" : value)} />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
