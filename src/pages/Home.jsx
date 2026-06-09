import { useEffect, useState, useRef } from "react";
import { getTickets, buscarTicket } from "../api/tickets.api";
import TicketForm from "../components/TicketForm";
import SearchTicket from "../components/SearchTicket";
import TicketDetalle from "../components/TicketDetalle";

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
    <div className="min-h-screen bg-gray-100 p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Gestión de Tickets
      </h1>

      {/* FORM + SEARCH */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <TicketForm onCreated={loadTickets} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <SearchTicket onResult={setTicketSeleccionado} />
        </div>
      </div>

      {/* DETALLE */}
      {ticketSeleccionado && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <TicketDetalle
            ticket={ticketSeleccionado}
            onUpdated={setTicketSeleccionado}
          />
        </div>
      )}

      {/* LISTA */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Lista de Tickets</h2>

        {tickets.map((t) => (
          <div
            key={t.id}
            className="border p-4 rounded-lg mb-3 flex justify-between items-center"
          >
            <div>
              <p><b>Serie:</b> {t.serie}</p>
              <p><b>Inventario:</b> {t.nroInventario}</p>
              <p><b>Estado:</b> {t.estado}</p>
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={async () => {
                const params = {};
                if (t.serie) params.serie = t.serie;
                else params.nroInventario = t.nroInventario;

                const res = await buscarTicket(params);
                setTicketSeleccionado(res.data);
              }}
            >
              Ver detalle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
