import api from "./axios";
/**
 * Crea un nuevo producto.
 *
 * @param {Object} data - Datos del producto
 * @returns {Promise<Object>}
 */
export const createProducto = async (data) => {

    const response = await api.post(`/producto`, data);
    return response.data;
 
};

/**
 * Obtiene todos los producto.
 *
 * @returns {Promise<Array>}
 */
export const getProducto = async ()=> {
 
    const response = await api.get(`/producto`);
    return response.data;
  
};
/**
 * Elimina un producto por ID.
 *
 * @param {number} id - ID del producto
 * @returns {Promise<Object>}
 */
export const deleteProducto = async (id) => {

    const response = await api.delete(`/producto/${id}`);
    return response.data;
 
};
/**
 * Actualiza un producto existente.
 *
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const updateProducto = async (id, data) => {
  
    const response = await api.put(`/producto/${id}`, data);
    return response.data;
  
};