/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable";
import {
  getProducto,
  deleteProducto,
} from "../api/productoApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
/**
 * Componente de tabla de productos.
 * Muestra listado de productos con opciones de editar y eliminar.
 * Consume datos desde la API y los renderiza en un GenericTable.
 */

const ProductoTable = () => {
    /**
   * Estado que almacena la lista de productos
   * @type {Array<Object>}
   */
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  /**
   * Obtiene la lista de productos desde el backend
   * @async
   */
  const fetchData = async () => {
    try {
      const res = await getProducto();
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
      await deleteProducto(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(t("producto.productoErrorDelete"));
    }
  };

  /**
   * Redirige al formulario de edición con los datos del cliente seleccionado
   * @param {Object} row - Cliente seleccionado
   */
  const handleEdit = (row) => {
    navigate("/producto-form", {
      state: {
        producto: row,
      },
    });
  };

  /**
   * Definición de columnas de la tabla
   * @type {Array<Object>}
   */
  const columns = [
    { field: "id", label: "ID" },
    { field: "cultivo.nombre", label: t("producto.idCultivo"), width: 80 },
    { field: "nombre", label: t("producto.nombre"), width: 80 },
    { field: "precio", label: t("producto.precio") },
    { field: "unidad_medida", label: t("producto.unidadMedida"),width: 60  },
    { field: "stock_actual", label: t("producto.cantidadDisponible"),width: 90  },
    { field: "fecha_cosecha", label: t("producto.fechaCosecha") },
    { field: "activo", label: t("producto.activo") },
  ];

  return (
    <GenericTable
      title={t("producto.list")}
      columns={columns}
      rows={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default ProductoTable;