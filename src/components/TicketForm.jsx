import { useState } from "react";
import { createTicket } from "../api/tickets.api";

function TicketForm({ onCreated }) {
  const [form, setForm] = useState({
    nroInventario: "",
    serie: "",
    problema: "",
    tipoDano: 1,
    procedeGarantia: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTicket(form);
      alert("✅ Ticket creado");

      onCreated(); // 🔥 recargar lista

      setForm({
        nroInventario: "",
        serie: "",
        problema: "",
        tipoDano: 1,
        procedeGarantia: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Crear Ticket</h2>

      <input
        name="nroInventario"
        placeholder="Nro Inventario"
        value={form.nroInventario}
        onChange={handleChange}
      />

      <br />

      <input
        name="serie"
        placeholder="Serie"
        value={form.serie}
        onChange={handleChange}
      />

      <br />

      <input
        name="problema"
        placeholder="Problema"
        value={form.problema}
        onChange={handleChange}
      />

      <br />

      {/* ✅ Tipo daño */}
      <select name="tipoDano" value={form.tipoDano} onChange={handleChange}>
        <option value={1}>Daño de fábrica</option>
        <option value={2}>Daño de usuario</option>
        <option value={3}>Software</option>
      </select>

      <br />

      {/* ✅ Garantía */}
      <select
        name="procedeGarantia"
        value={form.procedeGarantia}
        onChange={(e) =>
          setForm({
            ...form,
            procedeGarantia: e.target.value === "true",
          })
        }
      >
        <option value="true">Sí</option>
        <option value="false">No</option>
      </select>

      <br />

      <button type="submit">Crear</button>
    </form>
  );
}

export default TicketForm;