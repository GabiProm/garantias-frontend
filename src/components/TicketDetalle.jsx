import { useState } from "react";
import { getTicketById } from "../api/tickets.api";
import AddComponente from "./AddComponente";
import UpdateTicket from "./UpdateTicket";
import { useNavigate } from "react-router-dom";

function TicketDetalle({ ticket, onUpdated }) {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info"); // ✅ NUEVO

  if (!ticket) return null;

  const detalles = ticket.detalles || [];

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

      {/* ✅ VOLVER */}
      <button
        className="mb-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition"
        onClick={() => navigate("/lista")}
      >
        ← Volver
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Detalle del Ticket
      </h2>

      {/* ✅ TABS */}
      <div className="flex space-x-6 border-b mb-6">

        <button
          data-testid="tab-informacion"
          onClick={() => setActiveTab("info")}
          className={`pb-2 transition-all duration-200 hover:text-blue-500 ${
            activeTab === "info"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Información
        </button>

        <button
          data-testid="tab-componentes"
          onClick={() => setActiveTab("componentes")}
          className={`pb-2 transition-all duration-200 hover:text-blue-500 ${
            activeTab === "componentes"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Componentes
        </button>

        <button
          data-testid="tab-acciones"
          onClick={() => setActiveTab("acciones")}
          className={`pb-2 transition-all duration-200 hover:text-blue-500 ${
            activeTab === "acciones"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Acciones
        </button>

      </div>

      {/* 🔵 INFO */}
      {activeTab === "info" && (
        <div className="bg-gray-50 p-5 rounded-lg shadow mb-6 transition-all duration-300 ease-in-out animate-fadeIn">

          <h3 className="font-semibold text-lg mb-3">
            Información General
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <p><b>Serie:</b><span data-testid="detalle-serie"> {ticket.serie || "-"}</span></p>
            <p><b>Inventario:</b><span data-testid="detalle-inventario"> {ticket.nroInventario || "-"}</span></p>
            <p><b>Problema:</b><span data-testid="detalle-problema"> {ticket.problema || "-"}</span></p>
            <p><b>Tipo Daño:</b><span data-testid="detalle-tipo-dano"> {ticket.tipoDano || "-"}</span></p>
            <p><b>Ticket Rimac:</b><span data-testid="detalle-ticket-rimac"> {ticket.ticketRimac || "-"}</span></p>
            <p><b>Nro Caso:</b><span data-testid="detalle-nro-caso"> {ticket.nroCaso || "-"}</span></p>

            <p>
              <b>Estado:</b>
              <span data-testid="detalle-estado" className={`ml-2 px-2 py-1 rounded text-xs font-semibold
                ${ticket.estado === "Cerrado"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
                }`}>
                {ticket.estado || "-"}
              </span>
            </p>

            <p>
              <b>Fecha Reporte:</b>{" "}
              <span data-testid="detalle-fecha-reporte">
                {ticket.fechaReporte
                  ? new Date(ticket.fechaReporte).toLocaleDateString()
                  : "-"}
              </span>
            </p>
            
            <p>
              <b>Fecha Validación:</b>{" "}
              <span data-testid="detalle-fecha-validacion">
                {ticket.fechaValidacion
                  ? new Date(ticket.fechaValidacion).toLocaleDateString()
                  : "-"}
              </span>
            </p>

            <p>
              <b>Procede Garantía:</b>{" "}
              <span data-testid="detalle-garantia">
                {ticket.procedeGarantia || "-"}
              </span>
            </p>

            <p>
              <b>Observación:</b>{" "}
              <span data-testid="detalle-observacion">
                {ticket.observacion || "-"}
              </span>
            </p>

            <p>
              <b>Fecha Gestión:</b>{" "}
              <span data-testid="detalle-fecha-gestion">
                {ticket.fechaGestionGarantia
                  ? new Date(ticket.fechaGestionGarantia).toLocaleDateString()
                  : "-"}
              </span>
            </p>

          </div>
        </div>
      )}

      {/* 🟣 COMPONENTES */}
      {activeTab === "componentes" && (
        <div className="bg-gray-50 p-5 rounded-lg shadow mb-6 transition-all duration-300 ease-in-out animate-fadeIn">

          <h3 className="font-semibold text-lg mb-3">
            Componentes
          </h3>

          {detalles.length === 0 ? (
            <p className="text-gray-500 italic">
              No hay componentes registrados
            </p>
          ) : (
            <ul className="space-y-2">
              {detalles.map((d) => (
                <li
                  data-testid="detalle-componente"
                  key={d.id}
                  className="p-3 bg-white rounded border shadow-sm"
                >
                  <b>{d.componente}</b>
                  {d.observaciones && (
                    <div className="text-gray-500 text-sm">
                      {d.observaciones}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 🔴 ACCIONES */}
      {activeTab === "acciones" && (
        <div
            key={activeTab}
            className="space-y-6 animate-slideFadeIn"
          >

            {/* ✅ AGREGAR COMPONENTE */}
            <div className="bg-white p-5 rounded-xl shadow border">

              <h3 className="text-lg font-semibold mb-4">
                ➕ Agregar Componente
              </h3>

              <AddComponente
                ticketId={ticket.id}
                onAdded={reloadDetalle}
              />

            </div>

            {/* ✅ ACTUALIZAR TICKET */}
            <div className="bg-white p-5 rounded-xl shadow border">

              <h3 className="text-lg font-semibold mb-4">
                ✏️ Actualizar Ticket
              </h3>

              <UpdateTicket
                ticket={ticket}
                onUpdated={reloadDetalle}
              />

            </div>

          </div>

      )}

    </div>
  );
}

export default TicketDetalle;
