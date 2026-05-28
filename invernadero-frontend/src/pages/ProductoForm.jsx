import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField, Button, Box, MenuItem, FormControlLabel,
  Switch, Typography, Paper, Divider, InputAdornment,
  Snackbar, Alert,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { createProducto, updateProducto } from "../api/productoApi";
import { getCultivo } from "../api/cultivoApi";
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

const SectionLabel = ({ children }) => (
  <Typography
    variant="caption" fontWeight={700} color="#4f46e5"
    textTransform="uppercase" letterSpacing={0.8} display="block" mb={1}
  >
    {children}
  </Typography>
);

const ProductoForm = () => {
  const [cultivos, setCultivos] = useState([]);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const editData = location.state?.producto;

  const schema = Yup.object({
    id_cultivo: Yup.number().required(t("producto.cultivoObligatorio")),
    nombre: Yup.string().required(t("producto.nombreObligatorio")),
    descripcion: Yup.string(),
    precio: Yup.number().required(t("producto.precioObligatorio")),
    unidad_medida: Yup.string().required(t("producto.unidadObligatoria")),
    stock_actual: Yup.number().required(t("producto.stockActualObligatorio")),
    stock_minimo: Yup.number().required(t("producto.stockMinimoObligatorio")),
    categoria: Yup.string(),
    fecha_cosecha: Yup.date().nullable(),
    fecha_vencimiento: Yup.date().nullable(),
    activo: Yup.boolean(),
  });

  const handleClose = () => {
    setOpen(false);
    navigate("/informacionEntidades");
  };

  useEffect(() => {
    const fetchCultivos = async () => {
      try {
        const data = await getCultivo();
        setCultivos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCultivos();
  }, []);

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
            <ShoppingBagOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="grey.900" letterSpacing="-0.3px">
            {editData ? t("common.actualizar") : t("producto.guardar")}
          </Typography>
        </Box>

        <Paper elevation={0} sx={{
          border: "1px solid #e0e7ff", borderRadius: 3,
          boxShadow: "0 4px 24px rgba(79,70,229,0.08)", overflow: "hidden",
        }}>
          <Box sx={{ height: 4, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />

          <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Formik
              initialValues={{
                id_cultivo: editData?.id_cultivo || "",
                nombre: editData?.nombre || "",
                descripcion: editData?.descripcion || "",
                precio: editData?.precio || "",
                unidad_medida: editData?.unidad_medida || "",
                stock_actual: editData?.stock_actual || "",
                stock_minimo: editData?.stock_minimo || "",
                categoria: editData?.categoria || "",
                fecha_cosecha: editData?.fecha_cosecha || "",
                fecha_vencimiento: editData?.fecha_vencimiento || "",
                activo: editData?.activo ?? true,
              }}
              enableReinitialize
              validationSchema={schema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const payload = {
                    id_cultivo: Number(values.id_cultivo),
                    nombre: values.nombre,
                    descripcion: values.descripcion,
                    precio: Number(values.precio),
                    unidad_medida: values.unidad_medida,
                    stock_actual: Number(values.stock_actual),
                    stock_minimo: Number(values.stock_minimo),
                    categoria: values.categoria,
                    fecha_cosecha: values.fecha_cosecha || null,
                    fecha_vencimiento: values.fecha_vencimiento || null,
                    activo: values.activo,
                  };
                  if (editData) {
                    await updateProducto(editData.id, payload);
                    setMessage(t("producto.productoActualizado"));
                  } else {
                    await createProducto(payload);
                    setMessage(t("producto.productoCorrecto"));
                  }
                  setOpen(true);
                  resetForm();
                } catch (error) {
                  console.error(error);
                  setMessage(t("producto.productoError"));
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

                      {/* Cultivo vinculado */}
                      <Box>
                        <TextField
                          select
                          name="id_cultivo"
                          label={t("producto.idCultivo")}
                          value={values.id_cultivo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={showError("id_cultivo")}
                          helperText={showHelper("id_cultivo")}
                          fullWidth
                          data-testid="producto-cultivo-select"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Inventory2OutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={fieldSx}
                        >
                          {cultivos.map((cultivo) => (
                            <MenuItem key={cultivo.id} value={cultivo.id}>
                              {cultivo.nombre}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      {/* Información del producto */}
                      <Box>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <TextField
                            name="nombre"
                            label={t("producto.nombre")}
                            value={values.nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("nombre")}
                            helperText={showHelper("nombre")}
                            fullWidth
                            inputProps={{ "data-testid": "producto-nombre-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Inventory2OutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                          <TextField
                            name="descripcion"
                            label={t("producto.descripcion")}
                            multiline
                            rows={3}
                            value={values.descripcion}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            inputProps={{ "data-testid": "producto-descripcion-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <NoteOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      {/* Precio y unidad de medida */}
                      <Box>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <TextField
                            name="precio"
                            label={t("producto.precio")}
                            type="number"
                            value={values.precio}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("precio")}
                            helperText={showHelper("precio")}
                            fullWidth
                            inputProps={{ "data-testid": "producto-precio-input", min: 0 }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoneyOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                          <TextField
                            select
                            name="unidad_medida"
                            label={t("producto.unidadMedida")}
                            value={values.unidad_medida}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={showError("unidad_medida")}
                            helperText={showHelper("unidad_medida")}
                            fullWidth
                            data-testid="producto-unidad-select"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <StraightenOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          >
                            <MenuItem value="Kg">{t("producto.kg")}</MenuItem>
                            <MenuItem value="Libra">{t("producto.lb")}</MenuItem>
                            <MenuItem value="Unidad">{t("producto.uni")}</MenuItem>
                            <MenuItem value="Canasta">{t("producto.canasta")}</MenuItem>
                          </TextField>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      {/* Inventario */}
                      <Box>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                              name="stock_actual"
                              label={t("producto.cantidadDisponible")}
                              type="number"
                              value={values.stock_actual}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={showError("stock_actual")}
                              helperText={showHelper("stock_actual")}
                              fullWidth
                              inputProps={{ "data-testid": "producto-stockactual-input", min: 0 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LayersOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={fieldSx}
                            />
                            <TextField
                              name="stock_minimo"
                              label={t("producto.cantidadMinimaDis")}
                              type="number"
                              value={values.stock_minimo}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={showError("stock_minimo")}
                              helperText={showHelper("stock_minimo")}
                              fullWidth
                              inputProps={{ "data-testid": "producto-stockminimo-input", min: 0 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LayersOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={fieldSx}
                            />
                          </Box>
                          <TextField
                            name="categoria"
                            label={t("producto.categoria")}
                            value={values.categoria}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            inputProps={{ "data-testid": "producto-categoria-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocalOfferOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: "#f0f0f8" }} />

                      {/* Fechas */}
                      <Box>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <TextField
                            name="fecha_cosecha"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            label={t("producto.fechaCosecha")}
                            value={values.fecha_cosecha}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            inputProps={{ "data-testid": "producto-fechacosecha-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventAvailableOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                          <TextField
                            name="fecha_vencimiento"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            label={t("producto.fechaVen")}
                            value={values.fecha_vencimiento}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            inputProps={{ "data-testid": "producto-fechavencimiento-input" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventBusyOutlinedIcon sx={{ color: "#a5b4fc", fontSize: 18 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={fieldSx}
                          />
                        </Box>
                      </Box>

                      {/* Activo */}
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
                            {t("producto.activo")}
                          </Typography>
                        }
                      />

                      {/* Botón */}
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        data-testid="producto-guardar-btn"
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
                        {editData ? t("common.actualizar") : t("producto.guardar")}
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

export default ProductoForm;