import { getTicketById } from "../api/tickets.api";
import AddComponente from "./AddComponente";
import UpdateTicket from "./UpdateTicket";

function TicketDetalle({ ticket, onUpdated }) {

  // ✅ protección
  if (!ticket) return null;

  const detalles = ticket.detalles || [];

  // ✅ recargar desde backend (por ID 🔥)
  const reloadDetalle = async () => {
    try {
      const res = await getTicketById(ticket.id);
      onUpdated(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h2 className="text-xl font-bold mb-4">
        Detalle del Ticket
      </h2>

      {/* ✅ INFORMACIÓN PRINCIPAL */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        <p><b>Serie:</b> {ticket.serie || "-"}</p>
        <p><b>Inventario:</b> {ticket.nroInventario || "-"}</p>

        <p><b>Problema:</b> {ticket.problema || "-"}</p>
        <p><b>Tipo Daño:</b> {ticket.tipoDano || "-"}</p>

        <p>
          <b>Estado:</b>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold
            ${ticket.estado === "Cerrado"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
            }`}>
            {ticket.estado || "-"}
          </span>
        </p>

        <p>
          <b>Fecha Reporte:</b>{" "}
          {ticket.fechaReporte
            ? new Date(ticket.fechaReporte).toLocaleDateString()
            : "-"}
        </p>

        <p>
          <b>Fecha Gestión:</b>{" "}
          {ticket.fechaGestionGarantia
            ? new Date(ticket.fechaGestionGarantia).toLocaleDateString()
            : "-"}
        </p>

      </div>

      {/* ✅ COMPONENTES */}
      <h3 className="font-semibold mb-2">Componentes</h3>

      {detalles.length === 0 ? (
        <p>No hay componentes</p>
      ) : (
        <ul className="list-disc ml-6 mb-4">
          {detalles.map((d) => (
            <li key={d.id}>
              {d.componente} - {d.tipoGarantia}
              {d.observaciones && ` (${d.observaciones})`}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ ACCIONES */}
      <div className="space-y-4">

        <AddComponente
          ticketId={ticket.id}
          onAdded={reloadDetalle}
        />

        <UpdateTicket
          ticket={ticket}
          onUpdated={reloadDetalle}
        />

      </div>

    </div>
  );
}

export default TicketDetalle;