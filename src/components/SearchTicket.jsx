import { useState } from "react";
import { buscarTicket } from "../api/tickets.api";

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
      alert("No encontrado");
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-3">Buscar Ticket</h2>

      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Serie"
        value={serie}
        onChange={(e) => setSerie(e.target.value)}
      />
      <input
        className="border p-2 rounded w-full mb-2"
        placeholder="Inventario"
        value={inventario}
        onChange={(e) => setInventario(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSearch}
      >
        Buscar
      </button>
    </div>
  );
}

export default SearchTicket;
