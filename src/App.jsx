/*import Home from "./pages/Home";

function App() {
  return <Home />;
}

export default App;
*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import CrearTicket from "./pages/CrearTicket";
import BuscarTicket from "./pages/BuscarTicket";
import ListaTickets from "./pages/ListaTickets";
import DetalleTicket from "./pages/DetalleTicket";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        
        {/* ✅ SIDEBAR */}
        <Sidebar />

        {/* ✅ CONTENIDO */}
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/crear" element={<CrearTicket />} />
            <Route path="/buscar" element={<BuscarTicket />} />
            <Route path="/lista" element={<ListaTickets />} />
            <Route path="/detalle/:id" element={<DetalleTicket />} />

            {/* ✅ default */}
            <Route path="/" element={<ListaTickets />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;