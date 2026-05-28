import api from "./axios";
/**
 * Crea un nuevo cultivo.
 *
 * @param {Object} data - Datos del cultivo
 * @returns {Promise<Object>}
 */
export const createCultivo = async (data) => {
 
    const response = await api.post(`/cultivo`, data);
    return response.data;
  
};


/**
 * Obtiene todos los cultivo.
 *
 * @returns {Promise<Array>}
 */
export const getCultivo = async ()=> {
 
    const response = await api.get(`/cultivo`);
    return response.data;
  
};

/**
 * Elimina un cultivo por ID.
 *
 * @param {number} id - ID del cultivo
 * @returns {Promise<Object>}
 */

export const deleteCultivo = async (id) => {

    const response = await api.delete(`/cultivo/${id}`);
    return response.data;
 
};

/**
 * Actualiza un cultivo existente.
 *
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateCultivo = async (id, data) => {
  
    const response = await api.put(`/cultivo/${id}`, data);
    return response.data;
  
};
