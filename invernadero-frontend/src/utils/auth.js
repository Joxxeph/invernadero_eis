/* eslint-disable no-unused-vars */
/**
 * @file authUtils.js
 * @description Utilidades para manejo de autenticación basada en JWT.
 * Incluye almacenamiento, eliminación y lectura de token desde localStorage,
 * así como extracción de información del usuario (rol y username).
 */

/**
 * Guarda el token JWT en localStorage.
 * @param {string} token - Token JWT recibido desde el backend.
 */

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};
/**
 * Obtiene el token JWT almacenado en localStorage.
 * @returns {string|null} Token JWT o null si no existe.
 */
export const getToken = () => {
  return localStorage.getItem("token");
};
/**
 * Elimina el token JWT del localStorage (logout).
 */
export const removeToken = () => {
  localStorage.removeItem("token");
};
/**
 * Verifica si el usuario está autenticado.
 * @returns {boolean} true si existe token, false si no.
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
/**
 * Obtiene el rol del usuario desde el payload del JWT.
 *
 * @returns {string|null} Rol del usuario o null si no es válido.
 */
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.rol;
  } catch (error) {
    return null;
  }
};
/**
 * Obtiene el username del usuario desde el payload del JWT.
 *
 * @returns {string|null} Username o null si no es válido.
 */
export const getUsername = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch (error) {
    return null;
  }
};