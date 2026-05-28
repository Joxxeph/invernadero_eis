/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import { getCultivo, deleteCultivo } from "../api/cultivoApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
/**
 * Componente de tabla de cultivos.
 * Muestra listado de cultivos con opciones de editar y eliminar.
 * Consume datos desde la API y los renderiza en un GenericTable.
 */
const CultivoTable = () => {
    /**
   * Estado que almacena la lista de cultivos
   * @type {Array<Object>}
   */
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  /**
   * Obtiene la lista de cultivos desde el backend
   * @async
   */
  const fetchData = async () => {
    try {
      const res = await getCultivo();
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
      await deleteCultivo(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(t("common.errorDelete"));
    }
  };

  /**
   * Redirige al formulario de edición con los datos del cliente seleccionado
   * @param {Object} row - Cliente seleccionado
   */
  const handleEdit = (row) => {
    navigate("/cultivo-form", {
      state: {
        cultivo: row,
      },
    });
  };
  /**
   * Definición de columnas de la tabla
   * @type {Array<Object>}
   */
  const columns = [
    { field: "id", label: "ID" },
    { field: "nombre", label: t("cultivo.nombre"), width: 75  },
    { field: "fecha_siembra", label: t("cultivo.fechaSiembra") },
    { field: "area_sembrada", label: t("cultivo.areaSiembra") },
    { field: "cantidad_sembrada", label: t("cultivo.cantidadSembrada"),width: 80 },
    { field: "estado", label: t("cultivo.estado") },
    { field: `tipo_cultivo.nombre`, label: t("cultivo.tipoCultivo"),  width: 100 },
    { field: "activo", label: t("cultivo.activo") },
  ];

  return (
    <GenericTable
      title={t("cultivo.list")}
      columns={columns}
      rows={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default CultivoTable;