import api from "./axios";

/**
 * Obtiene el diagrama de entidades del sistema.
 *
 * @returns {Promise<Array>} Lista de entidades y relaciones
 */

export const getDiagram = async () => {
  try {
    const response = await api.get(`/diagram`);
    return response.data;
  } catch (error) {
    console.error("Error fetching diagram:", error);
    return [];
  }
};