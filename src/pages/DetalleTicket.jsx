import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getTicketById } from "../api/tickets.api";
import TicketDetalle from "../components/TicketDetalle";

function DetalleTicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const hasLoaded = useRef(false); // ✅ evitar doble ejecución

  const loadTicket = async () => {
    try {
      const res = await getTicketById(id);
      setTicket(res.data);
    } catch (error) {
      console.error("Error cargando ticket:", error);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      loadTicket();
      hasLoaded.current = true;
    }
  }, []);

  // ✅ protección
  if (!ticket) { 
    return (
      <div className="p-6 space-y-6 animate-pulse">

        {/* 🔲 TITULO */}
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>

        {/* 🔲 CARD INFO */}
        <div className="bg-gray-100 p-5 rounded-lg space-y-4">

          <div className="grid grid-cols-2 gap-4">

            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>

            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>

            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>

          </div>
        </div>

        {/* 🔲 COMPONENTES */}
        <div className="bg-gray-100 p-5 rounded-lg space-y-3">
          <div className="h-5 bg-gray-300 rounded w-1/4"></div>

          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <TicketDetalle
        ticket={ticket}
        onUpdated={setTicket} // 🔥 actualización dinámica
      />
    </div>
  );
}

export default DetalleTicketPage;
