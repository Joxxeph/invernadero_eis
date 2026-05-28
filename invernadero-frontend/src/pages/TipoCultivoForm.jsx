import React, { useState } from "react";
import { Formik, Form } from "formik";
import {
  TextField, Button, Box, FormControlLabel, Switch,
  Typography, Paper, Divider, InputAdornment, Snackbar, Alert,
} from "@mui/material";
import * as Yup from "yup";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { createTipoCultivo, updateTipoCultivo } from "../api/tipoCultivoApi";

// Estilos reutilizables (copiados de ClienteForm)
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

const TipoCultivoForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.tipoCultivo;

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const schema = Yup.object({
    nombre: Yup.string().required(t("tipoCultivo.nombreObligatorio")),
    descripcion: Yup.string().required(t("tipoCultivo.descripcionObligatoria")),
    clasificacion: Yup.string().required(t("tipoCultivo.clasificacionObligatoria")),
    tiempo_cosecha_dias: Yup.number()
      .typeError(t("tipoCultivo.cosechaNumero"))
      .required(t("tipoCultivo.cosechaObligatorio")),
    temporada: Yup.string().required(t("tipoCultivo.temporadaObligatoria")),
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
            <PersonSearchOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="grey.900" letterSpacing="-0.3px">
              {editData ? t("common.actualizar") : t("tipoCultivo.guardar")}
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{
          border: "1px solid #e0e7ff", borderRadius: 3,
          boxShadow: "0 4px 24px rgba(79,70,229,0.08)", overflow: "hidden",
        }}>
          {/* Franja superior decorativa */}
          <Box sx={{ height: 4, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />

          <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Formik
              initialValues={{
                nombre: editData?.nombre || "",
                descripcion: editData?.descripcion || "",
                clasificacion: editData?.clasificacion || "",
                tiempo_cosecha_dias: editData?.tiempo_cosecha_dias || "",
                temporada: editData?.temporada || "",
                activo: editData?.activo ?? true,
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
                    setMessage(t("tipoCultivo.tipoCultivoActualizado"));
                  } else {
                    await createTipoCultivo(payload);
                    setMessage(t("tipoCultivo.tipoCultivoCorrecto"));
                  }
                  setOpen(true);
                  resetForm();
                } catch (err) {
                  console.error(err);
                  setMessage(t("tipoCultivo.tipoCultivoError"));
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

                      {/* Nombre */}
                      <Box>
                       
                        <TextField
                          name="nombre"
                          label={t("tipoCultivo.nombre")}
                          value={values.nombre}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={showError("nombre")}
                          helperText={showHelper("nombre")}
                          fullWidth
                          inputProps={{ "data-testid": "tipocultivo-nombre-input" }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonSearchOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={fieldSx}
                        />
                      </Box>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      {/* Descripción */}
                      <TextField
                        name="descripcion"
                        label={t("tipoCultivo.descripcion")}
                        value={values.descripcion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showError("descripcion")}
                        helperText={showHelper("descripcion")}
                        fullWidth
                        inputProps={{ "data-testid": "tipocultivo-descripcion-input" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <NoteOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldSx}
                      />

                      {/* Clasificación y Días cosecha en fila */}
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                          name="clasificacion"
                          label={t("tipoCultivo.clasificacion")}
                          value={values.clasificacion}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={showError("clasificacion")}
                          helperText={showHelper("clasificacion")}
                          fullWidth
                          inputProps={{ "data-testid": "tipocultivo-clasificacion-input" }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalOfferOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={fieldSx}
                        />
                        <TextField
                          name="tiempo_cosecha_dias"
                          label={t("tipoCultivo.tiempoCosecha")}
                          type="number"
                          value={values.tiempo_cosecha_dias}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={showError("tiempo_cosecha_dias")}
                          helperText={showHelper("tiempo_cosecha_dias")}
                          inputProps={{ "data-testid": "tipocultivo-tiempocosechadias-input", min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ ...fieldSx, width: "45%" }}
                        />
                      </Box>

                      {/* Temporada */}
                      <TextField
                        name="temporada"
                        label={t("tipoCultivo.temporada")}
                        value={values.temporada}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showError("temporada")}
                        helperText={showHelper("temporada")}
                        fullWidth
                        inputProps={{ "data-testid": "tipocultivo-temporada-input" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WbSunnyOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldSx}
                      />

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
                            {t("tipoCultivo.activo")}
                          </Typography>
                        }
                      />

                      {/* Botón */}
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        data-testid="tipocultivo-guardar-btn"
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
                        {editData ? t("common.actualizar") : t("tipoCultivo.guardar")}
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

export default TipoCultivoForm;