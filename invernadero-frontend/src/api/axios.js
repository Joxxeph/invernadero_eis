/**
 * Cliente HTTP basado en Axios para consumo del backend.
 * Configura la URL base y añade automáticamente el token JWT en cada petición.
 */


import axios from "axios";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
/**
 * Interceptor de solicitudes.
 * Se ejecuta antes de cada request y agrega el token JWT si existe.
 *
 *@param {Object} config - Configuración de la petición Axios
 * @returns {Object}
 */
api.interceptors.request.use((config) => {
  const token = getToken();


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }


  return config;
});

export default api;