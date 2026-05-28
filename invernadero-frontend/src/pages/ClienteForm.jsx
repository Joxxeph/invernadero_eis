import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
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
  Snackbar,
  Alert,
} from "@mui/material";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { getPersona } from "../api/personaApi";
import { createCliente, updateCliente } from "../api/clienteApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Estilos reutilizables para los campos del formulario
// Se definen aquí para no repetir código en cada TextField
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
 * Formulario de registro/edición de clientes.
 *
 * Permite vincular una persona existente con datos comerciales:
 * categoría, descuento, frecuencia de compra y última fecha de compra.
 *
 * @author dvillamizar
 * @version 1.2.0
 */
const ClienteForm = () => {
  // Lista de personas obtenidas del backend para el selector
  const [personas, setPersonas] = useState([]);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  // Si venimos de la tabla de datos con state, estamos en modo edición
  const editData = location.state?.cliente;

  // Reglas de validación con Yup
  const schema = Yup.object({
    id_persona: Yup.number()
      .typeError(t("cliente.personaObligatoria"))
      .required(t("cliente.personaObligatoria")),
    categoria: Yup.string().required(t("cliente.categoriaObligatoria")),
    descuento: Yup.number()
      .typeError(t("cliente.debeSerNumero"))
      .required(t("cliente.descuentoObligatorio"))
      .min(0, t("cliente.descuentoRango"))
      .max(100, t("cliente.descuentoRango")),
    frecuencia_compra: Yup.string().required(t("cliente.frecuenciaObligatoria")),
    fecha_ultima_compra: Yup.date().nullable(),
  });

  // Cierra el snackbar y redirige al listado de datos
  const handleClose = () => {
    setOpen(false);
    navigate("/informacionEntidades");
  };

  // Carga inicial de personas registradas en el sistema
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await getPersona();
        setPersonas(data);
      } catch (err) {
        console.error("Error al cargar personas:", err);
      }
    };
    fetchPersonas();
  }, []);

  return (
    <>
      {/* Contenedor principal del formulario */}
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Encabezado de sección */}
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
            <PersonSearchOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} color="grey.900" letterSpacing="-0.3px">
              {editData ? t("common.actualizar") : t("cliente.guardar")}
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
          {/* Franja superior decorativa */}
          <Box
            sx={{
              height: 4,
              background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
            }}
          />

          <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
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
                    setMessage(t("cliente.clienteActualizado"));
                  } else {
                    await createCliente(payload);
                    setMessage(t("cliente.clienteCorrecto"));
                  }

                  setOpen(true);
                  resetForm();
                } catch (err) {
                  console.error("Error al guardar cliente:", err);
                  setMessage(t("cliente.clienteError"));
                  setOpen(true);
                }
              }}
            >
              {({ values, handleChange, handleBlur, errors, touched, submitCount }) => {
                // Helpers para mostrar errores solo tras interacción o submit
                const showError = (f) => (touched[f] || submitCount > 0) && Boolean(errors[f]);
                const showHelper = (f) => (touched[f] || submitCount > 0) && errors[f];

                return (
                  <Form>
                    <Box display="flex" flexDirection="column" gap={2.5}>

                      {/* Sección: Persona vinculada */}
                      <Box>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="#4f46e5"
                          textTransform="uppercase"
                          letterSpacing={0.8}
                          display="block"
                          mb={1}
                        >
                          {t("cliente.personaAsociada")}
                        </Typography>
                        <TextField
                          select
                          name="id_persona"
                          label={t("cliente.personaAsociada")}
                          value={values.id_persona}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={showError("id_persona")}
                          helperText={showHelper("id_persona")}
                          fullWidth
                          data-testid="cliente-persona-input"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonSearchOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={fieldSx}
                        >
                          {personas.map((persona) => (
                            <MenuItem key={persona.id} value={persona.id}>
                              {persona.nombre} {persona.apellido} — {persona.identificacion}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />


                      {/* Categoría y Descuento en fila */}
                      <Box sx={{ display: "flex", gap: 2 }}>
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
                          name="descuento"
                          label={t("cliente.descuento")}
                          type="number"
                          value={values.descuento}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={showError("descuento")}
                          helperText={showHelper("descuento")}
                          inputProps={{ "data-testid": "cliente-descuento-input", min: 0, max: 100 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PercentOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ ...fieldSx, width: "45%" }}
                        />
                      </Box>

                      {/* Frecuencia de compra */}
                      <TextField
                        name="frecuencia_compra"
                        label={t("cliente.frecuenciaCompra")}
                        value={values.frecuencia_compra}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={showError("frecuencia_compra")}
                        helperText={showHelper("frecuencia_compra")}
                        fullWidth
                        inputProps={{ "data-testid": "cliente-frecuencia-input" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <RepeatOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldSx}
                      />

                      {/* Fecha última compra */}
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
                        inputProps={{ "data-testid": "cliente-fechaCompra-input" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldSx}
                      />

                      {/* Botón de acción */}
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        data-testid="cliente-guardar-btn"
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
                        {editData ? t("common.actualizar") : t("cliente.guardar")}
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Paper>
      </Box>

      {/* Notificación de resultado */}
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

export default ClienteForm;
