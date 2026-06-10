import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">

      <h2 className="text-xl font-bold mb-6">Sistema Tickets</h2>

      <ul className="space-y-3">

        <li>
          <Link to="/crear" className="block p-2 hover:bg-gray-700 rounded">
            Crear Ticket
          </Link>
        </li>

        <li>
          <Link to="/buscar" className="block p-2 hover:bg-gray-700 rounded">
            Buscar Ticket
          </Link>
        </li>

        <li>
          <Link to="/lista" className="block p-2 hover:bg-gray-700 rounded">
            Lista de Tickets
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;