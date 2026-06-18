import api from "./axios";

// ✅ Obtener todos los tickets
export const getTickets = () => api.get("/tickets");

// ✅ Crear ticket
export const createTicket = (data) => api.post("/tickets", data);

// ✅ Buscar ticket
export const buscarTicket = (params) =>
  api.get("/tickets/buscar", { params });

// ✅ Actualizar ticket
export const updateTicket = (params, data) =>
  api.put("/tickets/buscar", data, { params });

// ✅ NUEVO - UPDATE POR ID (CORRECTO 🔥)
export const updateTicketById = (id, data) =>
  api.put(`/tickets/${id}`, data);

// ✅ Agregar componente
export const agregarComponente = (id, data) =>
  api.post(`/tickets/${id}/agregar-componente`, data);

// ✅ Obtener ticket por ID
export const getTicketById = (id) =>
  api.get(`/tickets/${id}`);

// ✅ Eliminar ticket
export const deleteTicket = (id) =>
  api.delete(`/tickets/${id}`);