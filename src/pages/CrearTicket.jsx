import TicketForm from "../components/TicketForm";

function CrearTicket() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <TicketForm onCreated={() => {}} />
    </div>
  );
}

export default CrearTicket;