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
      <div className="bg-white p-6 rounded shadow">
        <p>Cargando...</p>
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
