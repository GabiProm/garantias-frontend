import { useState } from "react";
import { buscarTicket } from "../api/tickets.api";
import toast from "react-hot-toast";

function SearchTicket({ onResult }) {
  const [serie, setSerie] = useState("");
  const [inventario, setInventario] = useState("");

  const handleSearch = async () => {
    try {
      const params = {};

      if (serie) params.serie = serie;
      if (inventario) params.nroInventario = inventario;

      const res = await buscarTicket(params);

      onResult(res.data);
    } catch (error) {
      console.error(error);
      toast.error("❌ Ticket no encontrado"); // ✅ NUEVO
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-3">Buscar Ticket</h2>

      <input
        data-testid="txt-buscar-serie"
        className="border p-2 rounded w-full mb-2"
        placeholder="Serie"
        value={serie}
        onChange={(e) => setSerie(e.target.value)}
      />
      <input
        data-testid="txt-buscar-inventario"
        className="border p-2 rounded w-full mb-2"
        placeholder="Inventario"
        value={inventario}
        onChange={(e) => setInventario(e.target.value)}
      />

      <button
        data-testid="btn-buscar-ticket"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSearch}
      >
        Buscar
      </button>
    </div>
  );
}

export default SearchTicket;
