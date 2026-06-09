import { buscarTicket } from "../api/tickets.api";
import AddComponente from "./AddComponente";
import UpdateTicket from "./UpdateTicket";

function TicketDetalle({ ticket, onUpdated }) {

  // ✅ PROTECCIÓN GENERAL
  if (!ticket) return null;

  // ✅ evitar errores de undefined
  const detalles = ticket.detalles || [];

  // ✅ recargar el ticket desde backend
  const reloadDetalle = async () => {
    try {
      const params = {};

      if (ticket.serie)
        params.serie = ticket.serie;
      else if (ticket.nroInventario)
        params.nroInventario = ticket.nroInventario;

      const res = await buscarTicket(params);

      // ✅ actualiza estado en el padre (Home.jsx)
      onUpdated(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Detalle del Ticket</h2>

      <p><b>Serie:</b> {ticket.serie}</p>
      <p><b>Inventario:</b> {ticket.nroInventario}</p>

      <p>
        <b>Estado:</b>
        <span
          className={`ml-2 px-2 py-1 rounded text-sm
          ${
            ticket.estado === "Cerrado"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {ticket.estado}
        </span>
      </p>

      <h3 className="mt-4 font-semibold">Componentes</h3>

      {detalles.length === 0 ? (
        <p>No hay componentes</p>
      ) : (
        <ul className="mt-2 list-disc ml-5">
          {detalles.map((d) => (
            <li key={d.id}>
              {d.componente} - {d.tipoGarantia}
              {d.observaciones && ` (${d.observaciones})`}
            </li>
          ))}
        </ul>
      )}

      <AddComponente ticketId={ticket.id} onAdded={reloadDetalle} />
      <UpdateTicket ticket={ticket} onUpdated={reloadDetalle} />
    </div>
  );
}

export default TicketDetalle;
