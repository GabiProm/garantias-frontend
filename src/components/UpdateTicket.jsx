import { useState } from "react";
import { updateTicket, buscarTicket } from "../api/tickets.api";
import toast from "react-hot-toast";

function UpdateTicket({ ticket, onUpdated }) {
  const [form, setForm] = useState({
    fechaReporte: "",
    fechaValidacion: "",
    fechaGestionGarantia: "",
    observacion: "",
    tipoDano: "",
    procedeGarantia: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const params = {};

      if (ticket.serie) params.serie = ticket.serie;
      else if (ticket.nroInventario)
        params.nroInventario = ticket.nroInventario;

      const data = {
        fechaReporte: form.fechaReporte || null,
        fechaValidacion: form.fechaValidacion || null,
        fechaGestionGarantia:
          form.fechaGestionGarantia || null,
        observacion: form.observacion,
        tipoDano: form.tipoDano ? parseInt(form.tipoDano) : null,
        procedeGarantia:
          form.procedeGarantia === ""
            ? null
            : form.procedeGarantia === "true",
      };

      await updateTicket(params, data);

      toast.success("Ticket actualizado"); // ✅ NUEVO

      const res = await buscarTicket(params);

      onUpdated(res.data);

      setForm({
        fechaValidacion: "",
        fechaGestionGarantia: "",
        observacion: "",
        tipoDano: "",
        procedeGarantia: "",
      });

    } catch (error) {
      console.error(error);
      toast.error("❌ Error al actualizar ticket"); // ✅ NUEVO
    }
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
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
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
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
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
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
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
              setForm({ ...form, tipoDano: e.target.value })
            }
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccionar</option>
            <option value="1">Daño por usuario</option>
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
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccionar</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
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
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* ✅ BOTÓN */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-2 rounded-lg 
                    hover:bg-blue-600 transition transform hover:scale-105 active:scale-95"
        >
          Actualizar
        </button>
      </div>

    </form>
  );
}

export default UpdateTicket;