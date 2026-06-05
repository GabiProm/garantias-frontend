import { useEffect, useState, useRef } from "react";
import { getTickets } from "../api/tickets.api";
import TicketForm from "../components/TicketForm";
import SearchTicket from "../components/SearchTicket";
import TicketDetalle from "../components/TicketDetalle";
import { buscarTicket } from "../api/tickets.api";

function Home() {
  const [tickets, setTickets] = useState([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const hasLoaded = useRef(false);

  const loadTickets = async () => {
    try {
      const res = await getTickets();
      setTickets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      loadTickets();
      hasLoaded.current = true;
    }
  }, []);

  return (
    <div>
      <h1>Tickets</h1>

      {/* ✅ FORMULARIO */}
      <TicketForm onCreated={loadTickets} />

      {/* ✅ BUSCADOR */}
      <SearchTicket onResult={setTicketSeleccionado} />

      {/* ✅ DETALLE */}
      <TicketDetalle
        ticket={ticketSeleccionado}
        onUpdated={setTicketSeleccionado} // 🔥 actualizar desde detalle
      />

      {/* ✅ LISTA */}
      <h2>Lista</h2>

      {tickets.map((t) => (
        <div
          key={t.id}
          style={{ border: "1px solid #ccc", margin: "10px" }}
        >
          <p><b>Serie:</b> {t.serie}</p>
          <p><b>Inventario:</b> {t.nroInventario}</p>
          <p><b>Estado:</b> {t.estado}</p>

          {/* ✅ BONUS: seleccionar directo desde lista */}       
            <button
            onClick={async () => {
                const params = {};

                if (t.serie) params.serie = t.serie;
                else if (t.nroInventario) params.nroInventario = t.nroInventario;

                const res = await buscarTicket(params);
                setTicketSeleccionado(res.data);
            }}
            >
            Ver detalle
            </button>

        </div>
      ))}
    </div>
  );
}

export default Home;