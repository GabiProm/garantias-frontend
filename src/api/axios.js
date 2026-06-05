import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5177/api", // ⚠️ puerto de tu backend
});

export default api;