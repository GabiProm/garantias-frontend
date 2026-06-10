import SearchTicket from "../components/SearchTicket";
import TicketDetalle from "../components/TicketDetalle";
import { useState } from "react";

function BuscarTicketPage() {
  const [ticket, setTicket] = useState(null);

  return (
    <div className="bg-white p-6 rounded shadow">
      <SearchTicket onResult={setTicket} />

      {ticket && (
        <div className="mt-6">
          <TicketDetalle ticket={ticket} onUpdated={setTicket} />
        </div>
      )}
    </div>
  );
}

export default BuscarTicketPage;