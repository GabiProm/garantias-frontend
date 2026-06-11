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

  return (
    <div className="p-6 space-y-8">

      <h2 className="text-2xl font-bold">📊 Dashboard</h2>

      {/* ✅ GARANTÍA + TIPO DAÑO */}
      <div className="grid grid-cols-2 gap-6">
        <GarantiaChart data={getGarantiaData(tickets)} />
        <TipoDanoChart data={getTipoDanoData(tickets)} />
      </div>

      {/* ✅ MES */}
      <CasosMesChart data={getCasosPorMes(tickets)} />

      {/* ✅ TRIMESTRE */}
      <CasosTrimestreChart data={getCasosPorTrimestre(tickets)} />

      {/* ✅ RANKING */}
      <RankingComponentes data={getRankingComponentes(tickets)} />

    </div>
  );
}

export default Dashboard;