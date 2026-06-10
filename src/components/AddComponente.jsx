import { useEffect, useState, useRef } from "react";
import { getComponentes } from "../api/componentes.api";
import { agregarComponente } from "../api/tickets.api";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

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

      toast.success("Componente agregado"); // ✅ NUEVO

      onAdded();

      setForm({
        componenteId: "",
        nuevoComponente: "",
        tipoGarantia: "",
        observaciones: "",
      });

    } catch (error) {
      console.error(error);
      toast.error("❌ Error al agregar componente"); // ✅ NUEVO
    }
  };

  
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>

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
      <textarea
        placeholder="Nuevo componente"
        value={form.nuevoComponente}
        onChange={(e) =>
          setForm({
            ...form,
            nuevoComponente: e.target.value,
            componenteId: "", // limpiar selección
          })
        }
        className="w-full max-w-xs bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg resize-none
                  focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
        rows={1}
      />

      <br />

      <button
        type="submit"
        className="mt-3 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg 
                  hover:bg-blue-600 transition transform hover:scale-105 active:scale-95 shadow"
      >
        <Plus size={18} />
        Agregar
      </button>

    </form>
  );
}

export default AddComponente;
