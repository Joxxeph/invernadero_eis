import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  MenuItem,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import CountertopsOutlinedIcon from "@mui/icons-material/CountertopsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { getTipoCultivo } from "../api/tipoCultivoApi";
import { createCultivo, updateCultivo } from "../api/cultivoApi";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Estilos base compartidos para todos los campos del formulario.
 * Se centralizan aquí para mantener consistencia visual y facilitar cambios futuros.
 *
 * @author mramirez
 * @version 2.0.1
 */
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
 * Etiqueta de sección reutilizable para separar grupos de campos.
 * Mantiene consistencia tipográfica en todo el formulario.
 */
const SectionLabel = ({ children }) => (
  <Typography
    variant="caption"
    fontWeight={700}
    color="#4f46e5"
    textTransform="uppercase"
    letterSpacing={0.8}
    display="block"
    mb={1}
  >
    {children}
  </Typography>
);

/**
 * Formulario de registro y edición de cultivos.
 *
 * Gestiona el ciclo de vida de un cultivo: desde la siembra hasta
 * la cosecha estimada y real, incluyendo métricas de rendimiento.
 *
 * Depende de: cultivoApi, tipoCultivoApi, Formik, Yup, react-i18next
 *
 * @author mramirez
 * @version 2.0.1
 */
const CultivoForm = () => {
  // Tipos de cultivo cargados desde backend para el selector
  const [tiposCultivo, setTiposCultivo] = useState([]);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  // Si location.state trae datos, el componente actúa en modo edición
  const editData = location.state?.cultivo;

  // Esquema de validación — todos los campos numéricos y de fecha son obligatorios
  const schema = Yup.object({
    nombre: Yup.string().required(t("cultivo.nombreObligatorio")),
    descripcion: Yup.string().required(t("cultivo.descripcionObligatoria")),
    fecha_siembra: Yup.date().required(t("cultivo.fechaSiembraObligatoria")),
    fecha_estimada_cosecha: Yup.date().required(t("cultivo.fechaEstimadaCosechaObligatoria")),
    fecha_cosecha: Yup.date().required(t("cultivo.fechaCosechaObligatoria")),
    area_sembrada: Yup.number().required(t("cultivo.areaSiembraObligatoria")),
    cantidad_sembrada: Yup.number().required(t("cultivo.cantidadSembradaObligatoria")),
    rendimiento_estimado: Yup.number().required(t("cultivo.rendimientoEsperadoObligatorio")),
    estado: Yup.string().required(t("cultivo.estadoObligatorio")),
    id_tipo_cultivo: Yup.number().required(t("cultivo.tipoCultivoObligatorio")),
    activo: Yup.boolean(),
  });

  // Redirige al listado de datos tras cerrar la notificación
  const handleClose = () => {
    setOpen(false);
    navigate("/informacionEntidades");
  };

  // Carga inicial de tipos de cultivo disponibles
  useEffect(() => {
    const fetchTiposCultivo = async () => {
      try {
        const data = await getTipoCultivo();
        setTiposCultivo(data);
      } catch (err) {
        console.error("Error cargando tipos de cultivo:", err);
      }
    };
    fetchTiposCultivo();
  }, []);

  return (
    <>
      <Box sx={{ maxWidth: 680, mx: "auto" }}>
        {/* Encabezado con ícono y modo actual */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
              flexShrink: 0,
            }}
          >
            <GrassOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="grey.900" letterSpacing="-0.3px">
              {editData ? t("common.actualizar") : t("cultivo.guardar")}
            </Typography>
          </Box>
        </Box>

        {/* Card principal */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e7ff",
            borderRadius: 3,
            boxShadow: "0 4px 24px rgba(79,70,229,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Franja decorativa superior — patrón compartido con otros formularios */}
          <Box sx={{ height: 4, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />

          <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Formik
              initialValues={{
                nombre: editData?.nombre || "",
                descripcion: editData?.descripcion || "",
                fecha_siembra: editData?.fecha_siembra || "",
                fecha_estimada_cosecha: editData?.fecha_estimada_cosecha || "",
                fecha_cosecha: editData?.fecha_cosecha || "",
                area_sembrada: editData?.area_sembrada || "",
                cantidad_sembrada: editData?.cantidad_sembrada || "",
                rendimiento_estimado: editData?.rendimiento_estimado || "",
                estado: editData?.estado || "",
                id_tipo_cultivo: editData?.id_tipo_cultivo || "",
                activo: editData?.activo ?? true,
              }}
              enableReinitialize
              validationSchema={schema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const payload = {
                    id_tipo_cultivo: Number(values.id_tipo_cultivo),
                    nombre: values.nombre,
                    descripcion: values.descripcion,
                    fecha_siembra: values.fecha_siembra,
                    fecha_estimada_cosecha: values.fecha_estimada_cosecha,
                    fecha_cosecha: values.fecha_cosecha,
                    area_sembrada: Number(values.area_sembrada),
                    cantidad_sembrada: Number(values.cantidad_sembrada),
                    rendimiento_estimado: Number(values.rendimiento_estimado),
                    estado: values.estado,
                    activo: values.activo,
                  };

                  if (editData) {
                    await updateCultivo(editData.id, payload);
                    setMessage(t("cultivo.cultivoActualizado"));
                  } else {
                    await createCultivo(payload);
                    setMessage(t("cultivo.cultivoCorrecto"));
                  }

                  setOpen(true);
                  resetForm();
                } catch (err) {
                  console.error("Error al persistir cultivo:", err);
                  setMessage(t("cultivo.cultivoError"));
                  setOpen(true);
                }
              }}
            >
              {({ values, handleChange, handleBlur, setFieldValue, errors, touched, submitCount }) => {
                // Muestra error solo si el campo fue tocado o se intentó enviar el form
                const showError = (f) => (touched[f] || submitCount > 0) && Boolean(errors[f]);
                const showHelper = (f) => (touched[f] || submitCount > 0) && errors[f];

                return (
                  <Form>
                    <Box display="flex" flexDirection="column" gap={2.5}>

                      
                      <TextField
                        name="nombre"
                        label={t("cultivo.nombre")}
                        value={values.nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showError("nombre")}
                        helperText={showHelper("nombre")}
                        fullWidth
                        inputProps={{ "data-testid": "cultivo-nombre-input" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GrassOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldSx}
                      />

                      <TextField
                        name="descripcion"
                        label={t("cultivo.descripcion")}
                        value={values.descripcion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showError("descripcion")}
                        helperText={showHelper("descripcion")}
                        fullWidth
                        multiline
                        rows={2}
                        inputProps={{ "data-testid": "cultivo-descripcion-input" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.2 }}>
                              <DescriptionOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldSx}
                      />

                      {/* Tipo de cultivo y Estado en la misma fila */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={7}>
                          <TextField
                            select
                            name="id_tipo_cultivo"
                            label={t("cultivo.tipoCultivo")}
                            value={values.id_tipo_cultivo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("id_tipo_cultivo")}
                            helperText={showHelper("id_tipo_cultivo")}
                            fullWidth
                            data-testid="cultivo-tipocultivo-select"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CategoryOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          >
                            {tiposCultivo.map((tipo) => (
                              <MenuItem key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            name="estado"
                            label={t("cultivo.estado")}
                            value={values.estado}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("estado")}
                            helperText={showHelper("estado")}
                            fullWidth
                            inputProps={{ "data-testid": "cultivo-estado-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FlagOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            name="fecha_siembra"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            label={t("cultivo.fechaSiembra")}
                            value={values.fecha_siembra}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("fecha_siembra")}
                            helperText={showHelper("fecha_siembra")}
                            fullWidth
                            inputProps={{ "data-testid": "cultivo-fechaSiembra-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarTodayOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 16 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            name="fecha_estimada_cosecha"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            label={t("cultivo.fechaEstimadaCosecha")}
                            value={values.fecha_estimada_cosecha}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("fecha_estimada_cosecha")}
                            helperText={showHelper("fecha_estimada_cosecha")}
                            fullWidth
                            inputProps={{ "data-testid": "cultivo-fechaestimadacosecha-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventAvailableOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 16 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            name="fecha_cosecha"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            label={t("cultivo.fechaCosecha")}
                            value={values.fecha_cosecha}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("fecha_cosecha")}
                            helperText={showHelper("fecha_cosecha")}
                            fullWidth
                            inputProps={{ "data-testid": "cultivo-fechacosecha-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarTodayOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 16 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            name="area_sembrada"
                            type="number"
                            label={t("cultivo.areaSiembra")}
                            value={values.area_sembrada}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("area_sembrada")}
                            helperText={showHelper("area_sembrada")}
                            fullWidth
                            inputProps={{ "data-testid": "cultivo-areasembrada-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SquareFootOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            name="cantidad_sembrada"
                            type="number"
                            label={t("cultivo.cantidadSembrada")}
                            value={values.cantidad_sembrada}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("cantidad_sembrada")}
                            helperText={showHelper("cantidad_sembrada")}
                            fullWidth
                            inputProps={{ "data-testid": "cultivo-cantidadsiembra-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CountertopsOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            name="rendimiento_estimado"
                            type="number"
                            label={t("cultivo.rendimientoEsperado")}
                            value={values.rendimiento_estimado}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("rendimiento_estimado")}
                            helperText={showHelper("rendimiento_estimado")}
                            fullWidth
                            inputProps={{ "data-testid": "cultivo-rendestimado-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <TrendingUpOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      {/* Switch de estado activo — usa setFieldValue de Formik para valores booleanos */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 1.5,
                          py: 1,
                          borderRadius: 2,
                          background: values.activo ? "rgba(79,70,229,0.05)" : "#fafafa",
                          border: "1px solid",
                          borderColor: values.activo ? "#c4b5fd" : "#f0f0f8",
                          transition: "all 0.2s",
                        }}
                      >
                        <Typography variant="body2" fontWeight={600} color="grey.700">
                          {t("cultivo.activo")}
                        </Typography>
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
                      </Box>

                      {/* Botón de envío — ícono varía según modo */}
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        data-testid="cultivo-guardar-btn"
                        startIcon={editData ? <EditOutlinedIcon /> : <SaveOutlinedIcon />}
                        sx={{
                          mt: 1,
                          py: 1.4,
                          borderRadius: 2.5,
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          textTransform: "none",
                          letterSpacing: 0.3,
                          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #4338ca, #6d28d9)",
                            boxShadow: "0 6px 20px rgba(79,70,229,0.45)",
                          },
                        }}
                      >
                        {editData ? t("common.actualizar") : t("cultivo.guardar")}
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Paper>
      </Box>

      {/* Notificación de éxito o error tras el submit */}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          severity="success"
          variant="filled"
          data-testid="success-snackbar"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CultivoForm;