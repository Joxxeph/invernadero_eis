import api from "./axios";

/**
 * Inicia sesión del usuario.
 *
 * @param {Object} data - Credenciales del usuario
 * @param {string} data.username - Nombre de usuario
 * @param {string} data.password - Contraseña
 * @returns {Promise<Object>} Respuesta del backend con token o estado
 */
export const loginRequest = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * Verifica el código OTP enviado al usuario.
 *
 * @param {Object} data - Datos OTP
 * @returns {Promise<Object>} Resultado de verificación
 */
export const verifyOtpRequest = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

/**
 * Obtiene la información del perfil del usuario autenticado.
 *
 * @returns {Promise<Object>} Datos del usuario
 */
export const perfilRequest = async () => {
  const response = await api.get("/auth/perfil");
  return response.data;
};
/**
 * Cierra la sesión del usuario.
 *
 * @returns {Promise<Object>} Respuesta del backend
 */
export const logoutRequest = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};