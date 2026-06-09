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
    <div
      style={{
        border: "2px solid black",
        padding: "15px",
        marginTop: "20px",
      }}
    >
      <h2>Detalle del Ticket</h2>

      <p><b>Serie:</b> {ticket.serie}</p>
      <p><b>Inventario:</b> {ticket.nroInventario}</p>
      <p><b>Estado:</b> {ticket.estado}</p>
      <p><b>Problema:</b> {ticket.problema}</p>
      <p><b>Tipo Daño:</b> {ticket.tipoDano}</p>

      <h3>Componentes</h3>

      {/* ✅ PROTECCIÓN */}
      {detalles.length === 0 ? (
        <p>No hay componentes registrados</p>
      ) : (
        <ul>
          {detalles.map((d) => (
            <li key={d.id}>
              {d.componente} - {d.tipoGarantia}
              {d.observaciones && ` (${d.observaciones})`}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ AGREGAR COMPONENTE */}
      <AddComponente
        ticketId={ticket.id}
        onAdded={reloadDetalle}
      />

      {/* ✅ ACTUALIZAR / CERRAR */}
      <UpdateTicket
        ticket={ticket}
        onUpdated={reloadDetalle}
      />
    </div>
  );
}

export default TicketDetalle;
