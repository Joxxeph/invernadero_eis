import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box } from "@mui/material";
import { createTipoCultivo, updateTipoCultivo } from "../../api/tipoCultivoApi";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

/**
 * @file TipoCultivoForm.jsx
 * @description Formulario para la creación y actualización de tipo_cultivo.
 * Generado automáticamente el 2026-05-25.
 * @component
 */
const TipoCultivoForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const editData = location.state?.tipoCultivo;

  const schema = Yup.object({
    nombre: Yup.string()
      .required(t("tipo_cultivo.nombreObligatorio")),
    descripcion: Yup.string(),
    clasificacion: Yup.string(),
    tiempo_cosecha_dias: Yup.number()
      .typeError(t("tipo_cultivo.debeSerNumero")),
    temporada: Yup.string(),
    activo: Yup.boolean(),
  });

  const handleClose = () => {
    setOpen(false);
    navigate("/informacionEntidades");
  };

  return (
    <>
      <Formik
        initialValues={{
          nombre: editData?.nombre || "",
          descripcion: editData?.descripcion || "",
          clasificacion: editData?.clasificacion || "",
          tiempo_cosecha_dias: editData?.tiempo_cosecha_dias || "",
          temporada: editData?.temporada || "",
          activo: editData?.activo || "",
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const payload = {
              nombre: values.nombre,
              descripcion: values.descripcion,
              clasificacion: values.clasificacion,
              tiempo_cosecha_dias: Number(values.tiempo_cosecha_dias),
              temporada: values.temporada,
              activo: values.activo,
            };

            if (editData) {
              await updateTipoCultivo(editData.id, payload);
              setMessage(t("tipo_cultivo.actualizado"));
            } else {
              await createTipoCultivo(payload);
              setMessage(t("tipo_cultivo.creadoCorrecto"));
            }

            setOpen(true);
            resetForm();
          } catch (error) {
            console.error(error);
            setMessage(t("tipo_cultivo.error"));
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
                  name="nombre"
                  label={t("tipo_cultivo.nombre")}
                  value={values.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("nombre")}
                  helperText={showHelper("nombre")}
                  fullWidth
                  inputProps={{ "data-testid": "tipo_cultivo-nombre-input" }}
                />

                <TextField
                  name="descripcion"
                  label={t("tipo_cultivo.descripcion")}
                  value={values.descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("descripcion")}
                  helperText={showHelper("descripcion")}
                  fullWidth
                  inputProps={{ "data-testid": "tipo_cultivo-descripcion-input" }}
                />

                <TextField
                  name="clasificacion"
                  label={t("tipo_cultivo.clasificacion")}
                  value={values.clasificacion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("clasificacion")}
                  helperText={showHelper("clasificacion")}
                  fullWidth
                  inputProps={{ "data-testid": "tipo_cultivo-clasificacion-input" }}
                />

                <TextField
                  name="tiempo_cosecha_dias"
                  label={t("tipo_cultivo.tiempoCosechaDias")}
                  type="number"
                  value={values.tiempo_cosecha_dias}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("tiempo_cosecha_dias")}
                  helperText={showHelper("tiempo_cosecha_dias")}
                  fullWidth
                  inputProps={{ "data-testid": "tipo_cultivo-tiempo-cosecha-dias-input" }}
                />

                <TextField
                  name="temporada"
                  label={t("tipo_cultivo.temporada")}
                  value={values.temporada}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("temporada")}
                  helperText={showHelper("temporada")}
                  fullWidth
                  inputProps={{ "data-testid": "tipo_cultivo-temporada-input" }}
                />

                <TextField
                  name="activo"
                  label={t("tipo_cultivo.activo")}
                  value={values.activo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={showError("activo")}
                  helperText={showHelper("activo")}
                  fullWidth
                  inputProps={{ "data-testid": "tipo_cultivo-activo-input" }}
                />

                <Button type="submit" variant="contained" data-testid="tipo_cultivo-guardar-btn">
                  {editData ? t("common.actualizar") : t("tipo_cultivo.guardar")}
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

export default TipoCultivoForm;