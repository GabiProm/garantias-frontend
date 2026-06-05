import api from "./axios";

export const getComponentes = () => api.get("/componentes");