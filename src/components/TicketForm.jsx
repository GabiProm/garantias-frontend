import { useState } from "react";
import { createTicket } from "../api/tickets.api";
import toast from "react-hot-toast";


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
      toast.success("Ticket creado con éxito"); // ✅ NUEVO

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
      toast.error("❌ Error al crear ticket"); // ✅ NUEVO
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-semibold mb-3">Crear Ticket</h2>

      <input className="border p-2 rounded w-full mb-2"
        name="nroInventario"
        placeholder="Inventario"
        value={form.nroInventario}
        onChange={handleChange}
      />

      <input className="border p-2 rounded w-full mb-2"
        name="serie"
        placeholder="Serie"
        value={form.serie}
        onChange={handleChange}
      />

      <input className="border p-2 rounded w-full mb-2"
        name="problema"
        placeholder="Problema"
        value={form.problema}
        onChange={handleChange}
      />

      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Crear
      </button>
    </form>
  );
}

export default TicketForm;