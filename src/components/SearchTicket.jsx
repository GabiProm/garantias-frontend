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
    <div style={{ margin: "20px 0" }}>
      <h2>Buscar Ticket</h2>

      <input
        placeholder="Serie"
        value={serie}
        onChange={(e) => setSerie(e.target.value)}
      />

      <br />

      <input
        placeholder="Nro Inventario"
        value={inventario}
        onChange={(e) => setInventario(e.target.value)}
      />

      <br />

      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}

export default SearchTicket;
