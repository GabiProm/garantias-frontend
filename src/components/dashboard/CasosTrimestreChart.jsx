import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function CasosTrimestreChart({ data }) {

  // ✅ ORDEN CORRECTO DE TRIMESTRES
  const orden = ["Q1", "Q2", "Q3", "Q4", "Sin dato"];

  const sortedData = [...data].sort(
    (a, b) => orden.indexOf(a.trimestre) - orden.indexOf(b.trimestre)
  );

  // ✅ DETECTAR AÑOS DINÁMICAMENTE (SIN ROMPER TU ESTRUCTURA)
  const yearsSet = new Set();

  sortedData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== "trimestre") {
        yearsSet.add(key);
      }
    });
  });

  const years = Array.from(yearsSet);

  // ✅ NORMALIZAR DATA (EVITA ERRORES VISUALES)
  const normalizedData = sortedData.map(item => {
    const newItem = { ...item };

    years.forEach(year => {
      if (newItem[year] == null) {
        newItem[year] = 0;
      }
    });

    return newItem;
  });

  // ✅ DETECTAR PICO GLOBAL
  let peak = { value: -Infinity };

  normalizedData.forEach(item => {
    years.forEach(year => {
      if ((item[year] || 0) > peak.value) {
        peak = {
          trimestre: item.trimestre,
          year,
          value: item[year]
        };
      }
    });
  });

  // ✅ COLORES
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-4">

      {/* ✅ INSIGHT (NUEVO 🔥) */}
      <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
        🚨 Mayor carga en <strong>{peak.trimestre} {peak.year}</strong> ({peak.value} casos)
      </div>

      {/* ✅ CHART */}
      <div className="w-full h-[320px]">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalizedData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="trimestre" />

            <YAxis />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                color: "#fff"
              }}
            />

            <Legend />

            {/* ✅ LÍNEAS DINÁMICAS */}
            {years.map((year, index) => (
              <Line
                key={year}
                type="monotone"
                dataKey={year}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ r: 4 }}
                name={year}
              />
            ))}

          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}