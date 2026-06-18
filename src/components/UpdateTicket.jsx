import { useState, useEffect, useRef } from "react";
import { updateTicketById, buscarTicket, getTicketById } from "../api/tickets.api";
import toast from "react-hot-toast";

function UpdateTicket({ ticket, onUpdated }) {
  const [form, setForm] = useState({
    fechaReporte: "",
    fechaValidacion: "",
    fechaGestionGarantia: "",
    observacion: "",
    tipoDano: "",
    procedeGarantia: "",
    ticketRimac: "",
    nroCaso: "",
  });

  // ✅ 2. REF (IMPORTANTE)
  const [initialForm, setInitialForm] = useState(null);

  // ✅ 3. AUTOCOMPLETADO
  useEffect(() => {
    if (!ticket) return;

    const mapped = {
      fechaReporte: ticket.fechaReporte
        ? ticket.fechaReporte.split("T")[0]
        : "",

      fechaValidacion: ticket.fechaValidacion
        ? ticket.fechaValidacion.split("T")[0]
        : "",

      fechaGestionGarantia: ticket.fechaGestionGarantia
        ? ticket.fechaGestionGarantia.split("T")[0]
        : "",

      observacion: ticket.observacion || "",
      /*
      tipoDano:
        ticket.tipoDano === "Daño por usuario"
          ? "1"
          : ticket.tipoDano === "Daño de fábrica"
          ? "2"
          : ticket.tipoDano === "Software"
          ? "3"
          : "",
      */
     
      tipoDano:
          ticket.tipoDanoId != null
            ? String(ticket.tipoDanoId)
            : "",
 
      procedeGarantia:
        ticket.procedeGarantia === "Sí"
          ? "true"
          : ticket.procedeGarantia === "No"
          ? "false"
          : "",

      ticketRimac: ticket.ticketRimac || ticket.TicketRimac || "",
      nroCaso: ticket.nroCaso || ticket.NroCaso || "",
    };

    // ✅ evitar re-render innecesario (MUY IMPORTANTE 🔥)
    setForm((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(mapped)) {
        return prev;
      }
      return mapped;
    });

    setInitialForm(mapped); // ✅ guardar estado original
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.id]); // ✅ SOLO CUANDO CAMBIE EL ID DEL TICKET


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      /*
      const params = {};

      if (ticket.serie) params.serie = ticket.serie;
      else if (ticket.nroInventario)
        params.nroInventario = ticket.nroInventario;
      */
      const id = ticket.id;
      const data = {
        fechaReporte: form.fechaReporte || null,
        fechaValidacion: form.fechaValidacion || null,
        fechaGestionGarantia:
          form.fechaGestionGarantia || null,
        observacion: form.observacion,
        tipoDano: form.tipoDano === "" ? null : parseInt(form.tipoDano),
        procedeGarantia:
          form.procedeGarantia === ""
            ? null
            : form.procedeGarantia === "true",
        ticketRimac: form.ticketRimac || null,
        nroCaso: form.nroCaso || null,
      };

      await updateTicketById(id, data);

      toast.success("Ticket actualizado"); // ✅ NUEVO

      const res = await getTicketById(id);

      onUpdated(res.data);
      /*
      setForm({
        fechaValidacion: "",
        fechaGestionGarantia: "",
        observacion: "",
        tipoDano: "",
        procedeGarantia: "",
        ticketRimac: "",
        nroCaso: "",
      });*/

    } catch (error) {
      console.error(error);
      toast.error("❌ Error al actualizar ticket"); // ✅ NUEVO
    }
  };

  const isChanged =  JSON.stringify(form) !== JSON.stringify(initialForm);
    
  const isFieldChanged = (field) => {
    return form[field] !== initialForm?.[field];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ✅ GRID PRINCIPAL */}
      <div className="grid grid-cols-2 gap-4">

        {/* ✅ Fecha Reporte */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha Reporte
          </label>
          <input
            type="date"
            value={form.fechaReporte}
            onChange={(e) =>
              setForm({ ...form, fechaReporte: e.target.value })
            }
            className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              ${isFieldChanged("fechaReporte")
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-300"}`}

          />
        </div>

        {/* ✅ Fecha Validación */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha Validación
          </label>
          <input
            type="date"
            value={form.fechaValidacion}
            onChange={(e) =>
              setForm({ ...form, fechaValidacion: e.target.value })
            }
            className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              ${isFieldChanged("fechaValidacion")
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-300"}`}

          />
        </div>

        {/* ✅ Fecha Gestión */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha Gestión (cierre)
          </label>
          <input
            type="date"
            value={form.fechaGestionGarantia}
            onChange={(e) =>
              setForm({
                ...form,
                fechaGestionGarantia: e.target.value,
              })
            }
            className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              ${isFieldChanged("fechaGestionGarantia")
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-300"}`}
          />
        </div>

        {/* ✅ Tipo Daño */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tipo de Daño
          </label>
          <select
            value={form.tipoDano}
            onChange={(e) =>
              setForm({ ...form, tipoDano: e.target.value || "" })
            }
            className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              ${isFieldChanged("tipoDano")
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-300"}`}
          >
            <option value="">Seleccionar</option>
            <option value="1">Daño de usuario</option>
            <option value="2">Daño de fábrica</option>
            <option value="3">Software</option>
          </select>
        </div>

        {/* ✅ Procede Garantía */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Procede Garantía
          </label>
          <select
            value={form.procedeGarantia}
            onChange={(e) =>
              setForm({ ...form, procedeGarantia: e.target.value })
            }
            className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              ${isFieldChanged("procedeGarantia")
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-300"}`}
          >
            <option value="">Seleccionar</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* ✅ Ticket Rimac */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Ticket Rimac
          </label>
          <input
            type="text"
            value={form.ticketRimac}
            onChange={(e) =>
              setForm({ ...form, ticketRimac: e.target.value })
            }
            className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              ${isFieldChanged("ticketRimac")
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-300"}`}
          />
        </div>

        {/* ✅ Nro Caso */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nro Caso
          </label>
          <input
            type="text"
            value={form.nroCaso}
            onChange={(e) =>
              setForm({ ...form, nroCaso: e.target.value })
            }
            className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              ${isFieldChanged("nroCaso")
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-300"}`}
          />
        </div>
      </div>
      
      {/* ✅ OBSERVACIÓN (FULL WIDTH) */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Observación
        </label>
        <textarea
          value={form.observacion}
          onChange={(e) =>
            setForm({ ...form, observacion: e.target.value })
          }
          className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
            ${isFieldChanged("observacion")
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-300"}`}
        />
      </div>

      {/* ✅ BOTÓN */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isChanged}
          className={`px-5 py-2 rounded-lg text-white transition
            ${isChanged
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"}
          `}
        >
          Actualizar
        </button>
      </div>

    </form>
  );
}

export default UpdateTicket;