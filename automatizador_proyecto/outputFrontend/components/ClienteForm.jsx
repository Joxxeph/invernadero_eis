import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import { getPersona } from "../../api/personaApi";
import { createCliente, updateCliente } from "../../api/clienteApi";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

/**
 * @file ClienteForm.jsx
 * @description Formulario para la creación y actualización de cliente.
 * Generado automáticamente el 2026-05-25.
 * @component
 */
const ClienteForm = () => {
  const [personas, setPersonas] = useState([]);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const editData = location.state?.cliente;

  const schema = Yup.object({
    id_persona: Yup.number()
      .typeError(t("cliente.idPersonaObligatorio"))
      .required(t("cliente.idPersonaObligatorio")),
    categoria: Yup.string(),
    descuento: Yup.number()
      .typeError(t("cliente.debeSerNumero"))
      .min(0, t("cliente.descuentoRango"))
      .max(100, t("cliente.descuentoRango")),
    frecuencia_compra: Yup.string(),
    fecha_ultima_compra: Yup.date()
      .nullable(),
  });

  const handleClose = () => {
    setOpen(false);
    navigate("/informacionEntidades");
  };

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await getPersona();
        setPersonas(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPersonas();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          id_persona: editData?.id_persona || "",
          categoria: editData?.categoria || "",
          descuento: editData?.descuento || "",
          frecuencia_compra: editData?.frecuencia_compra || "",
          fecha_ultima_compra: editData?.fecha_ultima_compra || "",
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const payload = {
              id_persona: Number(values.id_persona),
              categoria: values.categoria,
              descuento: Number(values.descuento),
              frecuencia_compra: values.frecuencia_compra,
              fecha_ultima_compra: values.fecha_ultima_compra || null,
            };

            if (editData) {
              await updateCliente(editData.id, payload);
              setMessage(t("cliente.actualizado"));
            } else {
              await createCliente(payload);
              setMessage(t("cliente.creadoCorrecto"));
            }

            setOpen(true);
            resetForm();
          } catch (error) {
            console.error(error);
            setMessage(t("cliente.error"));
            setOpen(true);
          }
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
          submitCount,
        }) => {
          const showError = (field) =>
            (touched[field] || submitCount > 0) && Boolean(errors[field]);
          const showHelper = (field) =>
            (touched[field] || submitCount > 0) && errors[field];

          return (
            <Form>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  select
                  name="id_persona"
                  label={t("cliente.idPersona")}
                  value={values.id_persona}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("id_persona")}
                  helperText={showHelper("id_persona")}
                  fullWidth
                  data-testid="cliente-id-persona-input"
                >
                  {personas.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}{item.apellido ? ` ${item.apellido}` : ""}{item.identificacion ? ` - ${item.identificacion}` : ""}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  name="categoria"
                  label={t("cliente.categoria")}
                  value={values.categoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("categoria")}
                  helperText={showHelper("categoria")}
                  fullWidth
                  inputProps={{ "data-testid": "cliente-categoria-input" }}
                />

                <TextField
                  name="descuento"
                  label={t("cliente.descuento")}
                  type="number"
                  value={values.descuento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("descuento")}
                  helperText={showHelper("descuento")}
                  fullWidth
                  inputProps={{ "data-testid": "cliente-descuento-input" }}
                />

                <TextField
                  name="frecuencia_compra"
                  label={t("cliente.frecuenciaCompra")}
                  value={values.frecuencia_compra}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("frecuencia_compra")}
                  helperText={showHelper("frecuencia_compra")}
                  fullWidth
                  inputProps={{ "data-testid": "cliente-frecuencia-compra-input" }}
                />

                <TextField
                  name="fecha_ultima_compra"
                  label={t("cliente.fechaUltimaCompra")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={values.fecha_ultima_compra}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("fecha_ultima_compra")}
                  helperText={showHelper("fecha_ultima_compra")}
                  fullWidth
                  inputProps={{ "data-testid": "cliente-fecha-ultima-compra-input" }}
                />

                <Button type="submit" variant="contained" data-testid="cliente-guardar-btn">
                  {editData ? t("common.actualizar") : t("cliente.guardar")}
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="success" data-testid="success-snackbar" variant="filled">
                  {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClienteForm;