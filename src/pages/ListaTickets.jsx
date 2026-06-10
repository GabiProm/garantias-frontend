import { useEffect, useState, useRef } from "react";
import { getTickets, deleteTicket } from "../api/tickets.api";
import { useNavigate } from "react-router-dom";

function ListaTickets() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const hasLoaded = useRef(false); // ✅ evita doble ejecución (StrictMode)

  const loadTickets = async () => {
    try {
      const res = await getTickets();
      setTickets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      loadTickets();
      hasLoaded.current = true;
    }
  }, []);

  // ✅ ELIMINAR
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar ticket?")) return;

    try {
      await deleteTicket(id);
      loadTickets(); // 🔁 refresca lista
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-semibold mb-4">
        Lista de Tickets
      </h2>

      <table className="w-full border text-sm">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Serie</th>
            <th className="p-2">Inventario</th>
            <th className="p-2">Problema</th>
            <th className="p-2">Fecha Reporte</th>
            <th className="p-2">Fecha Gestión</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="border-t text-center">

              {/* ✅ DATOS */}
              <td className="p-2">{t.serie || "-"}</td>
              <td className="p-2">{t.nroInventario || "-"}</td>
              <td className="p-2">{t.problema || "-"}</td>

              {/* ✅ FECHAS */}
              <td className="p-2">
                {t.fechaReporte
                  ? new Date(t.fechaReporte).toLocaleDateString()
                  : "-"}
              </td>

              <td className="p-2">
                {t.fechaGestionGarantia
                  ? new Date(t.fechaGestionGarantia).toLocaleDateString()
                  : "-"}
              </td>

              {/* ✅ ESTADO */}
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold
                  ${
                    t.estado === "Cerrado"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {t.estado || "-"}
                </span>
              </td>

              {/* ✅ ACCIONES */}
              <td className="p-2 space-x-2">

                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => navigate(`/detalle/${t.id}`)}
                >
                  Ver
                </button>

                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(t.id)}
                >
                  Eliminar
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default ListaTickets;