import api from "./axios";
/**
 * Crea un nuevo persona.
 *
 * @param {Object} data - Datos del persona
 * @returns {Promise<Object>}
 */
export const createPersona = async (data) => {
  
    const response = await api.post(`/persona`, data);
    return response.data;
 
};
/**
 * Obtiene todos los persona.
 *
 * @returns {Promise<Array>}
 */
export const getPersona = async ()=> {
 
    const response = await api.get(`/persona`);
    return response.data;
 
};

/**
 * Elimina un persona por ID.
 *
 * @param {number} id - ID del persona
 * @returns {Promise<Object>}
 */
export const deletePersona = async (id) => {

    const response = await api.delete(`/persona/${id}`);
    return response.data;
 
};
/**
 * Actualiza un persona existente.
 *
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updatePersona = async (id, data) => {
  
    const response = await api.put(`/persona/${id}`, data);
    return response.data;
  
};