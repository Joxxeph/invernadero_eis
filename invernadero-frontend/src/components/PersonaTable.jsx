/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import {
  getPersona,
  deletePersona,
} from "../api/personaApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
/**
 * Componente de tabla de personas.
 * Muestra listado de personas con opciones de editar y eliminar.
 * Consume datos desde la API y los renderiza en un GenericTable.
 */

const PersonaTable = () => {
    /**
   * Estado que almacena la lista de personas
   * @type {Array<Object>}
   */
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Obtiene la lista de personas desde el backend
   * @async
   */
  const fetchData = async () => {
    try {
      const res = await getPersona();
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
      await deletePersona(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(t("persona.errorDelete"));
    }
  };
  /**
   * Redirige al formulario de edición con los datos del cliente seleccionado
   * @param {Object} row - Cliente seleccionado
   */
  const handleEdit = (row) => {
    navigate("/persona-form", {
      state: {
        persona: row,
      },
    });
  };

  /**
   * Definición de columnas de la tabla
   * @type {Array<Object>}
   */
  const columns = [
    { field: "id", label: "ID", width: 20 },
    { field: "tipo_identificacion.abreviatura", label: t("persona.tipoIdentificacion"), width: 83},
    { field: "identificacion", label: t("persona.identificacion"), width: 83 },
    { field: "nombre", label: t("persona.nombre") , width:60},
    { field: "apellido", label: t("persona.apellido"), width: 60 },
    { field: "email", label: t("persona.email") , width: 80},
    { field: "telefono", label: t("persona.telefono") , width: 70},
    { field: "activo", label: t("persona.activo") , width: 50},
  ];

  return (
    <GenericTable
      title={t("persona.list")}
      columns={columns}
      rows={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default PersonaTable;