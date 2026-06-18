import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function CasosMesChart({ data }) {

  // ✅ MAPA DE MESES (para mostrar nombre completo)
  const mesesMap = {
    ene: "Enero",
    feb: "Febrero",
    mar: "Marzo",
    abr: "Abril",
    may: "Mayo",
    jun: "Junio",
    jul: "Julio",
    ago: "Agosto",
    sept: "Septiembre",
    oct: "Octubre",
    nov: "Noviembre",
    dic: "Diciembre"
  };

  const ordenMeses = [
    "ene","feb","mar","abr","may","jun",
    "jul","ago","sept","oct","nov","dic"
  ];  

  // ✅ PICO MÁS ALTO (MAYOR PROBLEMA)
  const maxItem2026 = data.reduce((max, item) =>
    (item["2026"] || 0) > (max["2026"] || 0) ? item : max
  , {});

  // ✅ TOTALES POR AÑO
  const total2025 = data.reduce((acc, item) => acc + (item["2025"] || 0), 0);
  const total2026 = data.reduce((acc, item) => acc + (item["2026"] || 0), 0);

  // ✅ DIFERENCIA
  const diferencia = total2026 - total2025;
  const porcentajeCambio = total2025
    ? ((diferencia / total2025) * 100).toFixed(1)
    : 0;

  // ✅ MENSAJE CORRECTO
  let tendenciaTexto = "";

  if (diferencia > 0) {
    tendenciaTexto = `🚨 Aumento de incidencias (+${porcentajeCambio}%)`;
  } else if (diferencia < 0) {
    tendenciaTexto = `✅ Reducción de incidencias (${porcentajeCambio}%)`;
  } else {
    tendenciaTexto = `➖ Sin variación relevante`;
  }

  // ✅ DETECTAR CAMBIO MÁS BRUSCO
  let mayorCambio = null;

  for (let i = 1; i < data.length; i++) {
    const actual = data[i]["2026"] || 0;
    const anterior = data[i - 1]["2026"] || 0;

    const diff = actual - anterior;

    if (!mayorCambio || Math.abs(diff) > Math.abs(mayorCambio.diff)) {
      mayorCambio = {
        mes: data[i].mes,
        diff
      };
    }
  }

  let cambioTexto = "";

  if (mayorCambio) {
    const mesNombre = mesesMap[mayorCambio.mes] || mayorCambio.mes;

    if (mayorCambio.diff > 0) {
      cambioTexto = `⚠️ Fuerte incremento en ${mesNombre} (+${mayorCambio.diff})`;
    } else {
      cambioTexto = `📉 Caída importante en ${mesNombre} (${mayorCambio.diff})`;
    }
  }

// const years = Object.keys(data[0] || {}).filter(key => key !== "mes");
  // ✅ DETECTAR TODOS LOS AÑOS (CORRECTO 🔥)
  const yearsSet = new Set();

  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== "mes") {
        yearsSet.add(key);
      }
    });
  });                             

  const years = Array.from(yearsSet);

  const normalizedData = data.map(item => {
    const newItem = { ...item };

    years.forEach(year => {
      if (newItem[year] == null) {
        newItem[year] = 0;
      }
    });

    return newItem;
  });

  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  const sortedData = [...data].sort(
    (a, b) => ordenMeses.indexOf(a.mes) - ordenMeses.indexOf(b.mes)
  );

    return (
      <div className="space-y-4">

        {/* ✅ INSIGHT INTELIGENTE */}
        <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">

          🚨 Mayor carga en{" "}
          <strong>
            {mesesMap[maxItem2026.mes] || maxItem2026.mes}
          </strong>{" "}
          ({maxItem2026["2026"]} casos)

          <br />

          {tendenciaTexto}: 2026 ({total2026}) vs 2025 ({total2025})

          <br />

          {cambioTexto}

        </div>

        {/* ✅ CHART */}
        <div className="w-full h-[320px]">

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="mes" />

              <YAxis />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />

              <Legend />

              {/* ✅ AREAS DINÁMICAS */}
              {years.map((year, index) => (
                <Area
                  key={year}
                  type="monotone"
                  dataKey={year}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.2}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name={year} // ✅ aparece en la leyenda
                />
              ))} 

            </AreaChart>
          </ResponsiveContainer>

        </div>
      </div>
    );
  }
