import api from "./axios";

/**
 * Crea un nuevo cliente.
 *
 * @param {Object} data - Datos del cliente
 * @returns {Promise<Object>}
 */
export const createCliente = async (data) => {
 
    const response = await api.post(`/cliente`, data);
    return response.data;
 
};

/**
 * Obtiene todos los clientes.
 *
 * @returns {Promise<Array>}
 */
export const getCliente = async ()=> {
 
    const response = await api.get(`/cliente`);
    return response.data;
  
};

/**
 * Elimina un cliente por ID.
 *
 * @param {number} id - ID del cliente
 * @returns {Promise<Object>}
 */
export const deleteCliente = async (id) => {

    const response = await api.delete(`/cliente/${id}`);
    return response.data;
 
};
/**
 * Actualiza un cliente existente.
 *
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */

export const updateCliente = async (id, data) => {
  
    const response = await api.put(`/cliente/${id}`, data);
    return response.data;
  
};