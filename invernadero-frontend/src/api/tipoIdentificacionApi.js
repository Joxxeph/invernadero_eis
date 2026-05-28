import api from "./axios";
/**
 * Crea un nuevo tipo de identificacion.
 *
 * @param {Object} data - Datos del tipo de identificacion
 * @returns {Promise<Object>}
 */
export const createTipoIdentificacion = async (data) => {
  const response = await api.post("/tipo_identificacion", data);
  return response.data;
};

/**
 * Actualiza un tipo de identificacion existente.
 *
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateTipoIdentificacion = async ( id, data) => {
  const response = await api.put(`/tipo_identificacion/${id}`, data);
  return response.data;
};

/**
 * Obtiene todos los tipo de identificacion.
 *
 * @returns {Promise<Array>}
 */
export const getTipoIdentificacion = async () => {
  const response = await api.get("/tipo_identificacion");
  return response.data;
};


/**
 * Elimina un tipo de identificacion por ID.
 *
 * @param {number} id - ID del tipo de identificacion
 * @returns {Promise<Object>}
 */
export const deleteTipoIdentificacion = async (id) => {
  const response = await api.delete(`/tipo_identificacion/${id}`);
  return response.data;
};
