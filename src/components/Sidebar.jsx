import { NavLink } from "react-router-dom";
import { FileText, Search, List } from "lucide-react";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-blue-900 text-blue-100 p-6 shadow-lg">

      {/* ✅ TITULO */}
      <h2 className="text-2xl font-bold mb-8 text-white">
        Garantías System
      </h2>

      {/* ✅ MENU */}
      <nav className="space-y-2">

        <NavLink
          to="/crear"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActive
              ? "bg-blue-500 text-white shadow"
              : "hover:bg-blue-800"}`
          }
        >
          <FileText size={18} />
          <span>Crear Ticket</span>
        </NavLink>

        <NavLink
          to="/buscar"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActive
              ? "bg-blue-500 text-white shadow"
              : "hover:bg-blue-800"}`
          }
        >
          <Search size={18} />
          <span>Buscar Ticket</span>
        </NavLink>

        <NavLink
          to="/lista"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
            ${isActive
              ? "bg-blue-500 text-white shadow"
              : "hover:bg-blue-800"}`
          }
        >
          <List size={18} />
          <span>Lista de Tickets</span>
        </NavLink>

      </nav>

      {/* ✅ FOOTER */}
      <div className="mt-10 text-xs text-blue-300">
        Sistema de Garantías v1.0
      </div>

    </div>
  );
}

export default Sidebar;