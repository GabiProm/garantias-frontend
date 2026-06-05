import { useEffect, useState, useRef } from "react";
import { getComponentes } from "../api/componentes.api";
import { agregarComponente } from "../api/tickets.api";
import api from "../api/axios";

function AddComponente({ ticketId, onAdded }) {
  const [componentes, setComponentes] = useState([]);
  const [form, setForm] = useState({
    componenteId: "",
    nuevoComponente: "",
    tipoGarantia: "",
    observaciones: "",
  });

  // ✅ evita doble ejecución (React StrictMode)
  const hasLoaded = useRef(false);

  // ✅ Cargar componentes

  const loadComponentes = async () => {
    try {
      const res = await getComponentes();
      setComponentes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ useEffect corregido
  useEffect(() => {
    if (!hasLoaded.current) {
      loadComponentes();
      hasLoaded.current = true;
    }
  }, []);

  // ✅ Submit
  
// ✅ Submit PRO
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let componenteId = form.componenteId;

      // 🔥 SI escribió uno nuevo
      if (form.nuevoComponente) {
        const res = await api.post("/componentes", {
          nombre: form.nuevoComponente,
        });

        componenteId = res.data.id;

        // ✅ recargar lista
        await loadComponentes();
      }

      // ✅ agregar al ticket
      await agregarComponente(ticketId, {
        componenteId: parseInt(componenteId),
        tipoGarantia: form.tipoGarantia,
        observaciones: form.observaciones,
      });

      alert("✅ Componente agregado");

      onAdded();

      setForm({
        componenteId: "",
        nuevoComponente: "",
        tipoGarantia: "",
        observaciones: "",
      });

    } catch (error) {
      console.error(error);
      alert("Error al agregar");
    }
  };

  
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h3>Agregar Componente</h3>

      {/* ✅ EXISTENTE */}
      <select
        value={form.componenteId}
        onChange={(e) =>
          setForm({
            ...form,
            componenteId: e.target.value,
            nuevoComponente: "", // limpiar nuevo
          })
        }
      >
        <option value="">Seleccione componente</option>

        {componentes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <p>--- o ---</p>

      {/* ✅ NUEVO COMPONENTE */}
      <input
        placeholder="Nuevo componente"
        value={form.nuevoComponente}
        onChange={(e) =>
          setForm({
            ...form,
            nuevoComponente: e.target.value,
            componenteId: "", // limpiar selección
          })
        }
      />

      <br />

      <input
        placeholder="Tipo Garantia"
        value={form.tipoGarantia}
        onChange={(e) =>
          setForm({ ...form, tipoGarantia: e.target.value })
        }
      />

      <br />

      <input
        placeholder="Observaciones"
        value={form.observaciones}
        onChange={(e) =>
          setForm({ ...form, observaciones: e.target.value })
        }
      />

      <br />

      <button type="submit">Agregar</button>
    </form>
  );
}

export default AddComponente;
