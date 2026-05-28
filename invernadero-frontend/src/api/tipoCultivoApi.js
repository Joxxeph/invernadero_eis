import api from "./axios";
/**
 * Crea un nuevo tipo cultivo.
 *
 * @param {Object} data - Datos del tipo cultivo
 * @returns {Promise<Object>}
 */
export const createTipoCultivo = async (data) => {
  
    const response = await api.post(`/tipo_cultivo`, data);
    return response.data;

};

/**
 * Elimina un tipo cultivo por ID.
 *
 * @param {number} id - ID del tipo cultivo
 * @returns {Promise<Object>}
 */

export const deleteTipoCultivo = async (id) => {

    const response = await api.delete(`/tipo_cultivo/${id}`);
    return response.data;
 
};

/**
 * Actualiza un tipo cultivo existente.
 *
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */

export const updateTipoCultivo = async (id, data) => {
  
    const response = await api.put(`/tipo_cultivo/${id}`, data);
    return response.data;
  
};

/**
 * Obtiene todos los tipo cultivo.
 *
 * @returns {Promise<Array>}
 */
export const getTipoCultivo = async ()=> {
  
    const response = await api.get(`/tipo_cultivo`);
    return response.data;
 
};