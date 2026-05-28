import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  Switch,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { getTipoIdentificacion } from "../api/tipoIdentificacionApi";
import { createPersona, updatePersona } from "../api/personaApi";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Estilos unificados para todos los TextField del formulario.
 * Centralizar aquí evita repetición y facilita ajustes globales.
 *
 * @author lcastillo
 * @version 1.1.0
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
 * Encabezado visual de sección dentro del formulario.
 * Reutilizable para separar grupos de campos relacionados.
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
 * Formulario de registro y edición de personas naturales.
 *
 * Maneja datos de identificación, contacto y dirección.
 * El campo fecha_registro se genera automáticamente en el submit,
 * no se expone al usuario.
 *
 * Depende de: personaApi, tipoIdentificacionApi, Formik, Yup
 *
 * @author lcastillo
 * @version 1.1.0
 */
const PersonaForm = () => {
  // Tipos de identificación cargados desde el backend (cédula, pasaporte, etc.)
  const [tipos, setTipos] = useState([]);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  // Detecta modo edición si se navega con state desde la tabla de datos
  const editData = location.state?.persona;

  // Reglas de validación — email con formato, campos opcionales como nullable
  const schema = Yup.object({
    id_tipo_identificacion: Yup.number()
      .typeError(t("persona.tipoIdentObligatorio"))
      .required(t("persona.tipoIdentObligatorio")),
    identificacion: Yup.string().required(t("persona.identificacionObligatoria")),
    nombre: Yup.string().required(t("persona.nombreObligatorio")),
    apellido: Yup.string().required(t("persona.apellidoObligatorio")),
    email: Yup.string()
      .email(t("persona.emailInvalido"))
      .required(t("persona.emailObligatorio")),
    telefono: Yup.string().nullable(),
    direccion: Yup.string().nullable(),
    activo: Yup.boolean(),
  });

  // Cierra el snackbar y regresa al listado
  const handleClose = () => {
    setOpen(false);
    navigate("/informacionEntidades");
  };

  // Carga de tipos de identificación al montar el componente
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const data = await getTipoIdentificacion();
        setTipos(data);
      } catch (err) {
        console.error("Error al cargar tipos de identificación:", err);
      }
    };
    fetchTipos();
  }, []);

  return (
    <>
      <Box sx={{ maxWidth: 620, mx: "auto" }}>
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
            <PersonOutlineIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="grey.900" letterSpacing="-0.3px">
              {editData ? t("common.actualizar") : t("persona.guardar")}
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e7ff",
            borderRadius: 3,
            boxShadow: "0 4px 24px rgba(79,70,229,0.08)",
            overflow: "hidden",
          }}
        >
          {/* Franja decorativa — patrón compartido con el resto de formularios */}
          <Box sx={{ height: 4, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />

          <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Formik
              initialValues={{
                id_tipo_identificacion: editData?.id_tipo_identificacion || "",
                identificacion: editData?.identificacion || "",
                nombre: editData?.nombre || "",
                apellido: editData?.apellido || "",
                email: editData?.email || "",
                telefono: editData?.telefono || "",
                direccion: editData?.direccion || "",
                activo: editData?.activo ?? true,
              }}
              enableReinitialize
              validationSchema={schema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const payload = {
                    id_tipo_identificacion: Number(values.id_tipo_identificacion),
                    identificacion: values.identificacion,
                    nombre: values.nombre,
                    apellido: values.apellido,
                    email: values.email,
                    telefono: values.telefono,
                    direccion: values.direccion,
                    activo: values.activo,
                    // La fecha se genera en el momento del submit, no se pide al usuario
                    fecha_registro: new Date().toISOString().split(".")[0],
                  };

                  if (editData) {
                    await updatePersona(editData.id, payload);
                    setMessage(t("persona.personaActualizada"));
                  } else {
                    await createPersona(payload);
                    setMessage(t("persona.personaCreada"));
                  }

                  setOpen(true);
                  resetForm();
                } catch (err) {
                  console.error("Error al persistir persona:", err);
                  setMessage(t("persona.personaError"));
                  setOpen(true);
                }
              }}
            >
              {({ values, handleChange, handleBlur, setFieldValue, errors, touched, submitCount }) => {
                // Controla visibilidad de errores: solo tras blur o intento de submit
                const showError = (f) => (touched[f] || submitCount > 0) && Boolean(errors[f]);
                const showHelper = (f) => (touched[f] || submitCount > 0) && errors[f];

                return (
                  <Form>
                    <Box display="flex" flexDirection="column" gap={2.5}>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            select
                            name="id_tipo_identificacion"
                            label={t("persona.tipoIdentificacion")}
                            value={values.id_tipo_identificacion}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("id_tipo_identificacion")}
                            helperText={showHelper("id_tipo_identificacion")}
                            fullWidth
                            data-testid="persona-tipoIdent-input"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BadgeOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          >
                            {tipos.map((tipo) => (
                              <MenuItem key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <TextField
                            name="identificacion"
                            label={t("persona.identificacion")}
                            value={values.identificacion}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("identificacion")}
                            helperText={showHelper("identificacion")}
                            fullWidth
                            inputProps={{ "data-testid": "persona-ident-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FingerprintOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="nombre"
                            label={t("persona.nombre")}
                            value={values.nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("nombre")}
                            helperText={showHelper("nombre")}
                            fullWidth
                            inputProps={{ "data-testid": "persona-nombre-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonOutlineIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="apellido"
                            label={t("persona.apellido")}
                            value={values.apellido}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("apellido")}
                            helperText={showHelper("apellido")}
                            fullWidth
                            inputProps={{ "data-testid": "persona-apellido-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonOutlineIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      <TextField
                        name="email"
                        label={t("persona.email")}
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showError("email")}
                        helperText={showHelper("email")}
                        fullWidth
                        inputProps={{ "data-testid": "persona-email-input" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldSx}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            name="telefono"
                            label={t("persona.telefono")}
                            value={values.telefono}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            inputProps={{ "data-testid": "persona-telefono-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <TextField
                            name="direccion"
                            label={t("persona.direccion")}
                            value={values.direccion}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            inputProps={{ "data-testid": "persona-direccion-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <HomeOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      {/* Switch de estado activo — booleans requieren setFieldValue en Formik */}
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
                          {t("persona.activo")}
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

                      {/* Botón principal — ícono cambia según modo crear/editar */}
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        data-testid="persona-guardar-btn"
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
                        {editData ? t("common.actualizar") : t("persona.guardar")}
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar compartido para éxito y error */}
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

export default PersonaForm;