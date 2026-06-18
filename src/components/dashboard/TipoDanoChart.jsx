import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function TipoDanoChart({ data }) {
  return (
    <div className="w-full h-[320px]">

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            interval={0}
            angle={0}   // ✅ limpio
            tick={{ fontSize: 12 }}
          />

          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderRadius: "8px",
              color: "#fff"
            }}
            labelStyle={{ color: "#fff" }}
          />

          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            barSize={70}   // ✅ más grande
          >
            <LabelList dataKey="value" position="top" />

            {data.map((entry, index) => {
              let color = "#3b82f6";

              if (entry.name === "Daño por usuario") color = "#ef4444";
              if (entry.name === "Daño de fábrica") color = "#f59e0b";
              if (entry.name === "Software") color = "#3b82f6";

              return <Cell key={index} fill={color} />;
            })}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}