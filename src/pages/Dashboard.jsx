import { useEffect, useState } from "react";
import { getTickets } from "../api/tickets.api";
import html2canvas from "html2canvas";

import GarantiaChart from "../components/dashboard/GarantiaChart";
import TipoDanoChart from "../components/dashboard/TipoDanoChart";
import CasosMesChart from "../components/dashboard/CasosMesChart";
import CasosTrimestreChart from "../components/dashboard/CasosTrimestreChart";
import RankingComponentes from "../components/dashboard/RankingComponentes";
import { generateInformeWord } from "../services/report.service";

import {
  getGarantiaData,
  getTipoDanoData,
  getCasosPorMes,
  getCasosPorTrimestre,
  getRankingComponentes
} from "../utils/dashboardData";

const captureChart = async (id) => {
  const element = document.getElementById(id);

  if (!element) return null;

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",

    // ✅ limpiar colores incompatibles como oklch
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(id);

      if (!clonedElement) return;

      // fondo blanco
      clonedElement.style.backgroundColor = "#ffffff";

      const nodes = clonedElement.querySelectorAll("*");

      nodes.forEach((node) => {
        const style = window.getComputedStyle(node);

        // reemplazar colores oklch
        if (style.color && style.color.includes("oklch")) {
          node.style.color = "#000000";
        }

        if (
          style.backgroundColor &&
          style.backgroundColor.includes("oklch")
        ) {
          node.style.backgroundColor = "#ffffff";
        }

        if (
          style.borderColor &&
          style.borderColor.includes("oklch")
        ) {
          node.style.borderColor = "#cccccc";
        }
      });
    }
  });

  return canvas.toDataURL("image/png");
};

function Dashboard() {
  // DATA
  const [tickets, setTickets] = useState([]);

  // FILTROS
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    getTickets().then(res => setTickets(res.data));
  }, []);
  
  // ✅ FILTRO GLOBAL
  const filteredTickets = tickets.filter((t) => {

    let matchFecha = true;

    if (fechaDesde || fechaHasta) {

      if (!t.fechaReporte) return false;

      const fecha = new Date(t.fechaReporte);
      const desde = fechaDesde ? new Date(fechaDesde) : null;
      const hasta = fechaHasta ? new Date(fechaHasta) : null;

      if (desde && fecha < desde) matchFecha = false;
      if (hasta && fecha > hasta) matchFecha = false;
    }

    return matchFecha;
  });

  const dataTipoDano = getTipoDanoData(filteredTickets);
  const dataRanking = getRankingComponentes(filteredTickets);

  // ✅ KPIs
  const totalTickets = filteredTickets.length;

  const abiertos = filteredTickets.filter(t => t.estado === "Abierto").length;

  const cerrados = filteredTickets.filter(t => t.estado === "Cerrado").length;

  const garantiasSi = filteredTickets.filter(
    t => t.procedeGarantia === "Sí"
  ).length;

  const garantiasNo = filteredTickets.filter(
    (t) => t.procedeGarantia === "No"
  ).length;

  // console.log(getTipoDanoData(tickets));

  return (
    <div className="p-6 space-y-5 bg-gray-100 min-h-screen">

      {/* ✅ HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">📊 Dashboard</h2>
        <p className="text-gray-500 text-sm">
          Análisis de tickets y garantías
        </p>
      </div>

      
      {/* ✅ FILTROS */}
      <div className="bg-white p-4 rounded-2xl shadow">

        <div className="flex flex-wrap gap-3 items-end">

          {/* DESDE */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* HASTA */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* LIMPIAR */}
          <button
            onClick={() => {
              setFechaDesde("");
              setFechaHasta("");
            }}
            className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
          >
            Limpiar
          </button>

          <button
          onClick={async () => {

          const imgGarantias = await captureChart("chart-garantias");
          const imgTipoDano = await captureChart("chart-tipo-dano");
          const imgRanking = await captureChart("chart-ranking");

          generateInformeWord({
            fechaDesde,
            fechaHasta,
            filteredTickets,
            totalTickets,
            abiertos,
            cerrados,
            garantiasSi,
            garantiasNo,
            imgGarantias,
            imgTipoDano,
            imgRanking,
            dataTipoDano,
            dataRanking
          });
        }}
          className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
        >
          Exportar Informe Word
        </button>

          {/* ✅ SHORTCUT: 7 DÍAS */}
          <button
            onClick={() => {
              const hoy = new Date();
              const hace7 = new Date();
              hace7.setDate(hoy.getDate() - 7);

              setFechaDesde(hace7.toISOString().split("T")[0]);
              setFechaHasta(hoy.toISOString().split("T")[0]);
            }}
            className="px-3 py-2 border border-blue-300 text-blue-600 rounded text-xs hover:bg-blue-100"
          >
            Últimos 7 días
          </button>

          {/* ✅ SHORTCUT: MES */}
          <button
            onClick={() => {
              const hoy = new Date();
              const inicioMes = new Date(
                hoy.getFullYear(),
                hoy.getMonth(),
                1
              );

              setFechaDesde(inicioMes.toISOString().split("T")[0]);
              setFechaHasta(hoy.toISOString().split("T")[0]);
            }}
            className="px-3 py-2 border border-blue-300 text-blue-600 rounded text-xs hover:bg-blue-100"
          >
            Este mes
          </button>
        </div>
      </div>

      <div id="reporte-dashboard" className="space-y-4 bg-white p-4">
        <div className="flex gap-2 mt-1">
            {fechaDesde && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[11px]">
                Desde: {fechaDesde}
              </span>
            )}
            {fechaHasta && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[11px]">
                Hasta: {fechaHasta}
              </span>
            )}
          </div>

          {/* ✅ KPI CARDS */}
          <div id="pdf-kpi" className="grid grid-cols-4 gap-6">

            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-2xl shadow">
              <p className="text-sm text-gray-500">Total Tickets</p>
              <h2 className="text-3xl font-bold text-red-700">{totalTickets}</h2>         
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-2xl shadow">
              <p className="text-sm text-gray-600">Garantía Sí</p>
              <h2 className="text-3xl font-bold text-green-700">{garantiasSi}</h2>      
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-2xl shadow">
              <p className="text-sm text-gray-600">Abiertos</p>
              <h2 className="text-3xl font-bold text-yellow-700">{abiertos}</h2>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-2xl shadow">
              <p className="text-sm text-gray-600">Cerrados</p>
              <h2 className="text-3xl font-bold text-blue-700">{cerrados}</h2>
            </div>

          </div>

          {/* ✅ GARANTÍA + TIPO DAÑO */}

          <div id="chart-garantias" className="bg-white p-5 rounded-2xl shadow mt-4 hover:shadow-lg transition" style={{ backgroundColor: "#ffffff" }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Procede Garantía
            </h3>
            <GarantiaChart data={getGarantiaData(filteredTickets)} />
          </div>

          <div id="chart-tipo-dano" className="bg-white p-5 rounded-2xl shadow mt-4 hover:shadow-lg transition" style={{ backgroundColor: "#ffffff" }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Tipo de Daño
            </h3>
            <TipoDanoChart data={getTipoDanoData(filteredTickets)} />
          </div>

          {/* ✅ MES */}
          <div className="bg-white p-5 rounded-2xl shadow mt-4 hover:shadow-lg transition" style={{ backgroundColor: "#ffffff" }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Casos por Mes
            </h3>
            <CasosMesChart data={getCasosPorMes(filteredTickets)} />
          </div>

          {/* ✅ TRIMESTRE */}
          <div className="bg-white p-5 rounded-2xl shadow mt-4 hover:shadow-lg transition" style={{ backgroundColor: "#ffffff" }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Casos por Trimestre
            </h3>
            <CasosTrimestreChart data={getCasosPorTrimestre(filteredTickets)} />
          </div>

          {/* ✅ RANKING */}
          <div id="chart-ranking" className="bg-white p-5 rounded-2xl shadow mt-4 hover:shadow-lg transition" style={{ backgroundColor: "#ffffff" }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Ranking de Componentes
            </h3>
            <RankingComponentes data={getRankingComponentes(filteredTickets)} />
          </div> 
      </div>
    </div>
  );
}

export default Dashboard;