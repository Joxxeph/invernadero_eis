import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField, Button, Box, FormControlLabel, Switch,
  Typography, Paper, Divider, InputAdornment, Snackbar, Alert,
} from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AbcOutlinedIcon from "@mui/icons-material/AbcOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { createTipoIdentificacion, updateTipoIdentificacion } from "../api/tipoIdentificacionApi";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    background: "#fafafa",
    transition: "box-shadow 0.2s",
    "&:hover fieldset": { borderColor: "#7c3aed" },
    "&.Mui-focused fieldset": { borderColor: "#4f46e5" },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(79,70,229,0.1)" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#4f46e5" },
};

/**
 * @file TipoIdentificacion Form.jsx
 * @description Formulario para la creación y actualización de TipoIdentificaciones.
 */
const TipoIdentificacionForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const editData = location.state?.tipoIdentificacion;

  const schema = Yup.object({
    nombre: Yup.string().required(t("tipoIdent.nombreObligatorio")),
    abreviatura: Yup.string().required(t("tipoIdent.abrevObligatorio")),
    activo: Yup.boolean(),
  });

  const handleClose = () => {
    setOpen(false);
    navigate("/informacionEntidades");
  };

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Encabezado */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(79,70,229,0.3)", flexShrink: 0,
          }}>
            <BadgeOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="grey.900" letterSpacing="-0.3px">
            {editData ? t("common.actualizar") : t("tipoIdent.guardar")}
          </Typography>
        </Box>

        <Paper elevation={0} sx={{
          border: "1px solid #e0e7ff", borderRadius: 3,
          boxShadow: "0 4px 24px rgba(79,70,229,0.08)", overflow: "hidden",
        }}>
          {/* Franja decorativa */}
          <Box sx={{ height: 4, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />

          <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Formik
              initialValues={{
                nombre: editData?.nombre || "",
                abreviatura: editData?.abreviatura || "",
                activo: editData?.activo ?? true,
              }}
              enableReinitialize
              validationSchema={schema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const payload = {
                    nombre: values.nombre,
                    abreviatura: values.abreviatura,
                    activo: values.activo,
                  };
                  if (editData) {
                    await updateTipoIdentificacion(editData.id, payload);
                    setMessage(t("tipoIdent.tipoIdentActualizado"));
                  } else {
                    await createTipoIdentificacion(payload);
                    setMessage(t("tipoIdent.tipoIdentCreado"));
                  }
                  setOpen(true);
                  resetForm();
                } catch (error) {
                  console.error(error);
                  setMessage(t("tipoIdent.tipoIdentError"));
                  setOpen(true);
                }
              }}
            >
              {({ values, handleChange, handleBlur, setFieldValue, errors, touched, submitCount }) => {
                const showError = (f) => (touched[f] || submitCount > 0) && Boolean(errors[f]);
                const showHelper = (f) => (touched[f] || submitCount > 0) && errors[f];

                return (
                  <Form>
                    <Box display="flex" flexDirection="column" gap={2.5}>

                      {/* Sección */}
                      <Box>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <TextField
                            name="nombre"
                            label={t("tipoIdent.nombre")}
                            value={values.nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("nombre")}
                            helperText={showHelper("nombre")}
                            fullWidth
                            inputProps={{ "data-testid": "tipoident-nombre-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BadgeOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                          <TextField
                            name="abreviatura"
                            label={t("tipoIdent.abrev")}
                            value={values.abreviatura}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("abreviatura")}
                            helperText={showHelper("abreviatura")}
                            fullWidth
                            inputProps={{ "data-testid": "tipoident-abreviatura-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AbcOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      {/* Switch activo */}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.activo}
                            onChange={(e) => setFieldValue("activo", e.target.checked)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "#4f46e5" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#7c3aed",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography fontSize="0.9rem" color="text.secondary">
                            {t("tipoIdent.activo")}
                          </Typography>
                        }
                      />

                      {/* Botón */}
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        data-testid="tipoident-guardar-btn"
                        startIcon={editData ? <EditOutlinedIcon /> : <SaveOutlinedIcon />}
                        sx={{
                          mt: 1, py: 1.4, borderRadius: 2.5, fontWeight: 700,
                          fontSize: "0.9rem", textTransform: "none", letterSpacing: 0.3,
                          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #4338ca, #6d28d9)",
                            boxShadow: "0 6px 20px rgba(79,70,229,0.45)",
                          },
                        }}
                      >
                        {editData ? t("common.actualizar") : t("tipoIdent.guardar")}
                      </Button>

                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Paper>
      </Box>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="success" variant="filled" data-testid="success-snackbar"
          sx={{ borderRadius: 2, fontWeight: 600 }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TipoIdentificacionForm;