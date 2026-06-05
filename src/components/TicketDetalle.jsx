import { buscarTicket } from "../api/tickets.api";
import AddComponente from "./AddComponente";

function TicketDetalle({ ticket, onUpdated }) {

  // ✅ Recargar detalle desde backend
  const reloadDetalle = async () => {
    try {
      const params = {};

      if (ticket.serie)
        params.serie = ticket.serie;
      else if (ticket.nroInventario)
        params.nroInventario = ticket.nroInventario;

      const res = await buscarTicket(params);

      // ✅ en vez de setState aquí → actualizamos en el padre
      onUpdated(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  if (!ticket) return null;

  return (
    <div style={{
      border: "2px solid black",
      padding: "15px",
      marginTop: "20px"
    }}>
      <h2>Detalle del Ticket</h2>

      <p><b>Serie:</b> {ticket.serie}</p>
      <p><b>Inventario:</b> {ticket.nroInventario}</p>
      <p><b>Estado:</b> {ticket.estado}</p>
      <p><b>Problema:</b> {ticket.problema}</p>
      <p><b>Tipo Daño:</b> {ticket.tipoDano}</p>

      <h3>Componentes</h3>

      {ticket.detalles.length === 0 ? (
        <p>No hay componentes registrados</p>
      ) : (
        <ul>
          {ticket.detalles.map((d) => (
            <li key={d.id}>
              {d.componente}
            </li>
          ))}
        </ul>
      )}

      <AddComponente
        ticketId={ticket.id}
        onAdded={reloadDetalle}
      />
    </div>
  );
}

export default TicketDetalle;
