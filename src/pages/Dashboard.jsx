import { useEffect, useState } from "react";
import { getTickets } from "../api/tickets.api";

import GarantiaChart from "../components/dashboard/GarantiaChart";
import TipoDanoChart from "../components/dashboard/TipoDanoChart";
import CasosMesChart from "../components/dashboard/CasosMesChart";
import CasosTrimestreChart from "../components/dashboard/CasosTrimestreChart";
import RankingComponentes from "../components/dashboard/RankingComponentes";

import {
  getGarantiaData,
  getTipoDanoData,
  getCasosPorMes,
  getCasosPorTrimestre,
  getRankingComponentes
} from "../utils/dashboardData";

function Dashboard() {

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then(res => setTickets(res.data));
  }, []);

  // ✅ KPIs
  const totalTickets = tickets.length;

  const abiertos = tickets.filter(t => t.estado === "Abierto").length;

  const cerrados = tickets.filter(t => t.estado === "Cerrado").length;

  const garantiasSi = tickets.filter(
    t => t.procedeGarantia === "Sí"
  ).length;

  console.log(getTipoDanoData(tickets));

  return (
    <div className="p-6 space-y-8 bg-linear-to-br from-gray-100 to-gray-200 min-h-screen">

      {/* ✅ HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">📊 Dashboard</h2>
        <p className="text-gray-500 text-sm">
          Análisis de tickets y garantías
        </p>
      </div>

      {/* ✅ KPI CARDS */}
      <div className="grid grid-cols-4 gap-6">

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

      <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Procede Garantía
         </h3>
        <GarantiaChart data={getGarantiaData(tickets)} />
      </div>

      <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Tipo de Daño
        </h3>
        <TipoDanoChart data={getTipoDanoData(tickets)} />
      </div>

      {/* ✅ MES */}
      <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Casos por Mes
        </h3>
        <CasosMesChart data={getCasosPorMes(tickets)} />
      </div>

      {/* ✅ TRIMESTRE */}
      <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Casos por Trimestre
        </h3>
        <CasosTrimestreChart data={getCasosPorTrimestre(tickets)} />
      </div>

      {/* ✅ RANKING */}
      <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Ranking de Componentes
        </h3>
        <RankingComponentes data={getRankingComponentes(tickets)} />
      </div>

    </div>
  );
}

export default Dashboard;