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
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-6">
        Lista de Tickets
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* ✅ HEADER */}
          <thead>
            <tr className="text-left border-b text-gray-600">
              <th className="p-3">Serie</th>
              <th className="p-3">Inventario</th>
              <th className="p-3">Problema</th>
              <th className="p-3">Fecha Reporte</th>
              <th className="p-3">Fecha Gestión</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acción</th>
            </tr>
          </thead>

          {/* ✅ BODY */}
          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-3 font-medium">{t.serie || "-"}</td>

                <td className="p-3 text-gray-600">
                  {t.nroInventario || "-"}
                </td>

                <td className="p-3">
                  {t.problema || "-"}
                </td>

                <td className="p-3 text-gray-500">
                  {t.fechaReporte
                    ? new Date(t.fechaReporte).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3 text-gray-500">
                  {t.fechaGestionGarantia
                    ? new Date(t.fechaGestionGarantia).toLocaleDateString()
                    : "-"}
                </td>

                {/* ✅ ESTADO ESTILO BADGE */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold
                    ${
                      t.estado === "Cerrado"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {t.estado || "-"}
                  </span>
                </td>

                {/* ✅ ACCIONES MODERNAS */}
                <td className="p-3 space-x-2">

                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition text-xs"
                    onClick={() => navigate(`/detalle/${t.id}`)}
                  >
                    Ver
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition text-xs"
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
    </div>
  );
}

export default ListaTickets;