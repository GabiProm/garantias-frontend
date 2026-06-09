import { useState } from "react";
import { updateTicket, buscarTicket } from "../api/tickets.api";

function UpdateTicket({ ticket, onUpdated }) {
  const [form, setForm] = useState({
    fechaValidacion: "",
    fechaGestionGarantia: "",
    observacion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const params = {};

      if (ticket.serie) params.serie = ticket.serie;
      else if (ticket.nroInventario)
        params.nroInventario = ticket.nroInventario;

      const data = {
        fechaValidacion: form.fechaValidacion || null,
        fechaGestionGarantia:
          form.fechaGestionGarantia || null,
        observacion: form.observacion,
      };

      await updateTicket(params, data);

      alert("✅ Ticket actualizado");

      const res = await buscarTicket(params);

      onUpdated(res.data);

      setForm({
        fechaValidacion: "",
        fechaGestionGarantia: "",
        observacion: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h3>Actualizar Ticket</h3>

      {/* ✅ Fecha Validación */}
      <label>Fecha Validación</label>
      <br />
      <input
        type="date"
        value={form.fechaValidacion}
        onChange={(e) =>
          setForm({ ...form, fechaValidacion: e.target.value })
        }
      />

      <br />

      {/* ✅ Observación */}
      <input
        placeholder="Observación"
        value={form.observacion}
        onChange={(e) =>
          setForm({ ...form, observacion: e.target.value })
        }
      />

      <br />

      {/* ✅ Fecha cierre */}
      <label>Fecha Gestión Garantía (cierre)</label>
      <br />
      <input
        type="date"
        value={form.fechaGestionGarantia}
        onChange={(e) =>
          setForm({
            ...form,
            fechaGestionGarantia: e.target.value,
          })
        }
      />

      <br />

      <button type="submit">Actualizar</button>
    </form>
  );
}

export default UpdateTicket;