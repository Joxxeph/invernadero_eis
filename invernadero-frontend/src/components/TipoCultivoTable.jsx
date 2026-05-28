/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import {
  getTipoCultivo,
  deleteTipoCultivo,
} from "../api/tipoCultivoApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
/**
 * Componente de tabla de tipos de cultivos.
 * Muestra listado de tipos de cultivos con opciones de editar y eliminar.
 * Consume datos desde la API y los renderiza en un GenericTable.
 */

const TipoCultivoTable = () => {
    /**
   * Estado que almacena la lista de tipos de cultivos
   * @type {Array<Object>}
   */
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  /**
   * Obtiene la lista de tipos de cultivos desde el backend
   * @async
   */
  const fetchData = async () => {
    try {
      const res = await getTipoCultivo();
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
      await deleteTipoCultivo(id);
      fetchData();
    } catch (error) {
      
      alert(t("tipoCultivo.errorDelete"));
      console.error(error);
    }
  };

  /**
   * Redirige al formulario de edición con los datos del cliente seleccionado
   * @param {Object} row - Cliente seleccionado
   */
  const handleEdit = (row) => {
    navigate("/tipo-cultivo-form", {
      state: {
        tipoCultivo: row,
      },
    });
  };

  /**
   * Definición de columnas de la tabla
   * @type {Array<Object>}
   */
  const columns = [
    { field: "id", label: "ID" },
    { field: "nombre", label: t("tipoCultivo.nombre") },
    { field: "clasificacion", label: t("tipoCultivo.clasificacion") },
    { field: "tiempo_cosecha_dias", label: t("tipoCultivo.tiempoCosecha") },
    { field: "temporada", label: t("tipoCultivo.temporada") },
    { field: "activo", label: t("tipoCultivo.activo") },
  ];

  return (
    <GenericTable
      title={t("tipoCultivo.list")}
      columns={columns}
      rows={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default TipoCultivoTable;