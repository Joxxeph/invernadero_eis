/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import {
  getCliente,
  deleteCliente,
} from "../api/clienteApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
/**
 * Componente de tabla de clientes.
 * Muestra listado de clientes con opciones de editar y eliminar.
 * Consume datos desde la API y los renderiza en un GenericTable.
 */

const ClienteTable = () => {  
  /**
   * Estado que almacena la lista de clientes
   * @type {Array<Object>}
   */
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Obtiene la lista de clientes desde el backend
   * @async
   */
  const fetchData = async () => {
    try {
      const res = await getCliente();
      setData(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  /**
   * Elimina un cliente después de confirmación del usuario
   * @param {number} id - ID del cliente
   */
  const handleDelete = async (id) => {
    const confirmar = window.confirm(t("common.eliminarConfirm"));
    if (!confirmar) return;

    try {
      await deleteCliente(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(t("cliente.errorDelete"));
    }
  };
  /**
   * Redirige al formulario de edición con los datos del cliente seleccionado
   * @param {Object} row - Cliente seleccionado
   */
  const handleEdit = (row) => {
    navigate("/cliente-form", {
      state: {
        cliente: row,
      },
    });
  };
  /**
   * Definición de columnas de la tabla
   * @type {Array<Object>}
   */
  const columns = [
    { field: "id", label: "ID" },
    { field: "persona.identificacion", label: t("cliente.personaAsociada") },
    { field: "categoria", label: t("cliente.categoria") },
    { field: "descuento", label: t("cliente.descuento") },
    { field: "frecuencia_compra", label: t("cliente.frecuenciaCompra") },
    { field: "fecha_ultima_compra", label: t("cliente.fechaUltimaCompra") },
  ];

  return (
    <GenericTable
      title={t("cliente.list")}
      columns={columns}
      rows={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default ClienteTable;