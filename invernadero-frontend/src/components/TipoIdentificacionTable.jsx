/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import {
  getTipoIdentificacion,
  deleteTipoIdentificacion,
} from "../api/tipoIdentificacionApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Componente de tabla de tipo de identificacion.
 * Muestra listado de tipo de identificacion con opciones de editar y eliminar.
 * Consume datos desde la API y los renderiza en un GenericTable.
 */
const TipoIdentificacionTable = () => {
    /**
   * Estado que almacena la lista de tipo de identificacion
   * @type {Array<Object>}
   */
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
    /**
   * Obtiene la lista de tipo de identificacion desde el backend
   * @async
   */
  const fetchData = async () => {
    try {
      const res = await getTipoIdentificacion();
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
      await deleteTipoIdentificacion(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(t("tipoIdent.errorDelete"));
    }
  };

  /**
   * Redirige al formulario de edición con los datos del cliente seleccionado
   * @param {Object} row - Cliente seleccionado
   */
  const handleEdit = (row) => {
    navigate("/tipo-identificacion-form", {
      state: {
        tipoIdentificacion: row,
      },
    });
  };

  /**
   * Definición de columnas de la tabla
   * @type {Array<Object>}
   */
  const columns = [
    { field: "id", label: "ID" },
    { field: "nombre", label: t("tipoIdent.nombre") },
    { field: "abreviatura", label: t("tipoIdent.abrev") },
    { field: "activo", label: t("tipoIdent.activo") },
  ];

  return (
    <GenericTable
      title={t("tipoIdent.list")}
      columns={columns}
      rows={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default TipoIdentificacionTable;
