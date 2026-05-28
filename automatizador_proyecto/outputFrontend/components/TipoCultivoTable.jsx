/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import { getTipoCultivo, deleteTipoCultivo } from "../../api/tipoCultivoApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * @file TipoCultivoTable.jsx
 * @description Componente de tabla para tipo_cultivo.
 * Muestra el listado con opciones de editar y eliminar.
 * Generado automáticamente el 2026-05-25.
 *
 * @component
 * @returns {JSX.Element} Tabla con datos de tipo_cultivo.
 */
const TipoCultivoTable = () => {
  /**
   * Estado que almacena la lista de tipo_cultivos
   * @type {Array<Object>}
   */
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Obtiene la lista de tipo_cultivos desde el backend
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
   * Elimina un tipo_cultivo después de confirmación del usuario
   * @param {number} id - ID del tipo_cultivo
   */
  const handleDelete = async (id) => {
    const confirmar = window.confirm(t("common.eliminarConfirm"));
    if (!confirmar) return;

    try {
      await deleteTipoCultivo(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(t("tipo_cultivo.errorDelete"));
    }
  };

  /**
   * Redirige al formulario de edición con los datos del tipo_cultivo seleccionado
   * @param {Object} row - Fila seleccionada
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
    { field: "nombre", label: t("tipo_cultivo.nombre") },
    { field: "descripcion", label: t("tipo_cultivo.descripcion") },
    { field: "clasificacion", label: t("tipo_cultivo.clasificacion") },
    { field: "tiempo_cosecha_dias", label: t("tipo_cultivo.tiempoCosechaDias") },
    { field: "temporada", label: t("tipo_cultivo.temporada") },
    { field: "activo", label: t("tipo_cultivo.activo") },
  ];

  return (
    <GenericTable
      title={t("tipo_cultivo.list")}
      columns={columns}
      rows={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default TipoCultivoTable;