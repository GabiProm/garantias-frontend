import { getTicketById } from "../api/tickets.api";
import AddComponente from "./AddComponente";
import UpdateTicket from "./UpdateTicket";
import {useNavigate} from "react-router-dom";

function TicketDetalle({ ticket, onUpdated }) {

  const navigate = useNavigate();

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

      {/* ✅ BOTÓN VOLVER */}
      <button
        className="mb-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition"
        onClick={() => navigate("/lista")}
      >
        ← Volver
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Detalle del Ticket
      </h2>

      {/* ✅ INFORMACIÓN (CARD) */}
      <div className="bg-gray-50 p-5 rounded-lg shadow mb-6">

        <h3 className="font-semibold text-lg mb-3">
          Información General
        </h3>

        <div className="grid grid-cols-2 gap-4 text-sm">

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
      </div>

      {/* ✅ COMPONENTES (CARD) */}
      <div className="bg-gray-50 p-5 rounded-lg shadow mb-6">

        <h3 className="font-semibold text-lg mb-3">
          Componentes
        </h3>

        {detalles.length === 0 ? (
          <p className="text-gray-500 italic">
            No hay componentes registrados
          </p>
        ) : (
          <ul className="list-disc ml-6 space-y-1">
            {detalles.map((d) => (
              <li key={d.id}>
                <span className="font-medium">{d.componente}</span> - {d.tipoGarantia}
                {d.observaciones && ` (${d.observaciones})`}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ ACCIONES (CARD) */}
      <div className="bg-gray-50 p-5 rounded-lg shadow">

        <h3 className="font-semibold text-lg mb-3">
          Acciones
        </h3>

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

    </div>
  );
}

export default TicketDetalle;