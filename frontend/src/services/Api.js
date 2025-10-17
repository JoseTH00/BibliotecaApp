import axios from "axios";

// Configuración base del backend
const api = axios.create({
  baseURL: "http://localhost:3001/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;