import { useEffect, useState, useRef } from "react";
import { getTickets, deleteTicket } from "../api/tickets.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { exportTicketsToExcel } from "../utils/exportExcel";

function ListaTickets() {
  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const hasLoaded = useRef(false);

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

  // ✅ FILTRADO
  const filteredTickets = tickets.filter((t) => {
    const texto = search.toLowerCase();

    const matchSearch =
      t.serie?.toLowerCase().includes(texto) ||
      t.nroInventario?.toLowerCase().includes(texto) ||
      t.nroCaso?.toLowerCase().includes(texto);

    const matchEstado =
      estadoFilter === "Todos" || t.estado === estadoFilter;

    let matchFecha = true;

    if (fechaDesde || fechaHasta) {
      if (!t.fechaReporte) return false;

      const fecha = new Date(t.fechaReporte);
      const desde = fechaDesde ? new Date(fechaDesde) : null;
      const hasta = fechaHasta ? new Date(fechaHasta) : null;

      if (desde && fecha < desde) matchFecha = false;
      if (hasta && fecha > hasta) matchFecha = false;
    }

    return matchSearch && matchEstado && matchFecha;
  });

  
  // ✅ KPI 🔥
  const total = filteredTickets.length;

  const abiertos = filteredTickets.filter(
    (t) => t.estado === "Abierto"
  ).length;

  const cerrados = filteredTickets.filter(
    (t) => t.estado === "Cerrado"
  ).length;

  // PAGINACIÓN
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  // RESET DE PAGINA AL CAMBIAR FILTROS
  useEffect(() => {
      setCurrentPage(1);
    }, [search, estadoFilter, fechaDesde, fechaHasta]);


  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar ticket?")) return;

    try {
      await deleteTicket(id);
      toast.success("Ticket eliminado ✅");
      loadTickets();
    } catch {
      toast.error("❌ Error al eliminar ticket");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        Lista de Tickets
      </h2>

      {/* ✅ KPI DASHBOARD COMPACTO */}
      <div className="flex gap-3 mb-4">

        {/* TOTAL */}
        <div
          className="flex-1 bg-white border rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition"
          onClick={() => setEstadoFilter("Todos")}
        >
          <p className="text-[10px] text-gray-500">Total</p>
          <h3 className="text-lg font-semibold">{total}</h3>
        </div>

        {/* ABIERTOS */}
        <div
          className={`flex-1 border rounded-lg px-4 py-2 shadow-sm cursor-pointer transition
            ${estadoFilter === "Abierto"
              ? "bg-green-500 text-white border-green-500"
              : "bg-green-50 border-green-200 hover:bg-green-100"
            }`}
          onClick={() => setEstadoFilter("Abierto")}
        >
          <p className="text-[10px]">Abiertos</p>
          <h3 className="text-lg font-semibold">{abiertos}</h3>
        </div>

        {/* CERRADOS */}
        <div
          className={`flex-1 border rounded-lg px-4 py-2 shadow-sm cursor-pointer transition
            ${estadoFilter === "Cerrado"
              ? "bg-red-500 text-white border-red-500"
              : "bg-red-50 border-red-200 hover:bg-red-100"
            }`}
          onClick={() => setEstadoFilter("Cerrado")}
        >
          <p className="text-[10px]">Cerrados</p>
          <h3 className="text-lg font-semibold">{cerrados}</h3>
        </div>

      </div>

      {/* ✅ FILTROS */}
      <div className="bg-gray-50 border rounded-lg p-3 mb-4">

        <div className="flex flex-wrap items-end gap-3">

          {/* 🔍 BUSCAR */}
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-500 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Serie / Inventario"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded-lg w-[180px]"
            />
          </div>

          {/* 📊 ESTADO */}
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-500 mb-1">Estado</label>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="border p-2 rounded-lg w-[140px]"
            >
              <option value="Todos">Todos</option>
              <option value="Abierto">Abierto</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>

          {/* 📅 DESDE */}
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* 📅 HASTA */}
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* 🔄 LIMPIAR */}
          <button
            onClick={() => {
              setSearch("");
              setEstadoFilter("Todos");
              setFechaDesde("");
              setFechaHasta("");
            }}
            className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
          >
            Limpiar
          </button>

          {/* 📊 EXPORT */}
          <button
            data-testid="btn-exportar-excel"
            onClick={() => exportTicketsToExcel(filteredTickets)}
            disabled={filteredTickets.length === 0}
            className={`px-3 py-2 rounded-lg text-white text-sm
              ${filteredTickets.length === 0
                ? "bg-gray-400"
                : "bg-green-500 hover:bg-green-600"
              }`}
          >
            Exportar
          </button>

        </div>
      </div>

      {/* ✅ SHORTCUTS */}
      <div className="text-xs text-gray-500 mb-2">
        Filtros rápidos
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            const hoy = new Date();
            const hace7 = new Date();
            hace7.setDate(hoy.getDate() - 7);

            setFechaDesde(hace7.toISOString().split("T")[0]);
            setFechaHasta(hoy.toISOString().split("T")[0]);
          }}
          className="px-3 py-2 border border-blue-300 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition"
        >
          📅 Últimos 7 días
        </button>

        <button
          onClick={() => {
            const hoy = new Date();
            const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

            setFechaDesde(inicioMes.toISOString().split("T")[0]);
            setFechaHasta(hoy.toISOString().split("T")[0]);
          }}
          className="px-3 py-2 border border-blue-300 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition"
        >
          📆 Este mes
        </button>
      </div>

      {/* ✅ CHIPS PRO */}
      <div className="flex flex-wrap gap-2 mb-4">

        {estadoFilter !== "Todos" && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs shadow-sm">
            <span className="font-medium">Estado:</span> {estadoFilter}
            <span
              onClick={() => setEstadoFilter("Todos")}
              className="cursor-pointer bg-white px-1 rounded-full hover:bg-red-100"
            >
              ✕
            </span>
          </div>
        )}

        {fechaDesde && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs shadow-sm">
            <span className="font-medium">Desde:</span> {fechaDesde}
            <span
              onClick={() => setFechaDesde("")}
              className="cursor-pointer bg-white px-1 rounded-full hover:bg-red-100"
            >
              ✕
            </span>
          </div>
        )}

        {fechaHasta && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs shadow-sm">
            <span className="font-medium">Hasta:</span> {fechaHasta}
            <span
              onClick={() => setFechaHasta("")}
              className="cursor-pointer bg-white px-1 rounded-full hover:bg-red-100"
            >
              ✕
            </span>
          </div>
        )}

        {search && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs shadow-sm">
            <span className="font-medium">Buscar:</span> {search}
            <span
              onClick={() => setSearch("")}
              className="cursor-pointer bg-white px-1 rounded-full hover:bg-red-100"
            >
              ✕
            </span>
          </div>
        )}

      </div>

      {/* ✅ TABLA */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

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

          <tbody>
            {currentTickets.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">

                <td className="p-3">{t.serie}</td>
                <td className="p-3">{t.nroInventario}</td>
                <td className="p-3">{t.problema}</td>

                <td className="p-3">
                  {t.fechaReporte && new Date(t.fechaReporte).toLocaleDateString()}
                </td>

                <td className="p-3">
                  {t.fechaGestionGarantia && new Date(t.fechaGestionGarantia).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs
                    ${t.estado === "Cerrado"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                    }`}>
                    {t.estado}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => navigate(`/detalle/${t.id}`)}
                  >
                    Ver
                  </button>

                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
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

      {/* ✅ PAGINACIÓN */}
      <div className="flex justify-between items-center mt-4">

        <span className="text-sm text-gray-500">
          Página {currentPage} de {totalPages}
        </span>

        <div className="flex gap-2">

          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>

        </div>

      </div>

    </div>
  );
}

export default ListaTickets;
