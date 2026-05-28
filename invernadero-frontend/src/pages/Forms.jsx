import React, { useState } from "react";
import { Paper, Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import TipoCultivoForm from "./TipoCultivoForm";
import CultivoForm from "./CultivoForm";
import PersonaForm from "./PersonaForm";
import TipoIdentificacionForm from "./TipoIdentificacionForm";
import ClienteForm from "./ClienteForm";
import ProductoForm from "./ProductoForm";

const entities = [
  {
    labelKey: "common.cliente",
    icon: <PeopleAltOutlinedIcon sx={{ fontSize: 20 }} />,
    form: <ClienteForm />,
  },
  {
    labelKey: "common.tipoCultivo",
    icon: <GrassOutlinedIcon sx={{ fontSize: 20 }} />,
    form: <TipoCultivoForm />,
  },
  {
    labelKey: "common.cultivo",
    icon: <AgricultureOutlinedIcon sx={{ fontSize: 20 }} />,
    form: <CultivoForm />,
  },
  {
    labelKey: "common.producto",
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 20 }} />,
    form: <ProductoForm />,
  },
  {
    labelKey: "common.tipoIdent",
    icon: <BadgeOutlinedIcon sx={{ fontSize: 20 }} />,
    form: <TipoIdentificacionForm />,
  },
  {
    labelKey: "common.persona",
    icon: <PersonOutlineIcon sx={{ fontSize: 20 }} />,
    form: <PersonaForm />,
  },
];

const Forms = () => {
  const [selected, setSelected] = useState(0);
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
        py: { xs: 3, sm: 4, md: 5 },
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color="grey.900" letterSpacing="-0.5px">
            {t("common.administracion") || "Administración"}
          </Typography>
        </Box>

        {/* Selector label */}


        {/* Entity cards grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 1.5,
            mb: 3,
          }}
        >
          {entities.map((entity, i) => {
            const active = selected === i;
            return (
              <Box
                key={i}
                onClick={() => setSelected(i)}
                sx={{
                  position: "relative",
                  background: "#fff",
                  border: active ? "1.5px solid #4f46e5" : "0.5px solid",
                  borderColor: active ? "#4f46e5" : "grey.200",
                  borderRadius: 3,
                  p: 2,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                  boxShadow: active
                    ? "0 0 0 3px rgba(79,70,229,0.12)"
                    : "none",
                  transition: "all 0.18s",
                  "&:hover": {
                    borderColor: "#7c3aed",
                    boxShadow: "0 0 0 3px rgba(79,70,229,0.10)",
                  },
                }}
              >
                {/* Dot activo */}
                {active && (
                  <Box sx={{
                    position: "absolute", top: 10, right: 10,
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#4f46e5",
                  }} />
                )}

                {/* Ícono */}
                <Box sx={{
                  width: 38, height: 38, borderRadius: 2,
                  background: active
                    ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                    : "#EEEDFE",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: active ? "#fff" : "#534AB7",
                  boxShadow: active ? "0 4px 10px rgba(79,70,229,0.25)" : "none",
                  transition: "all 0.18s",
                }}>
                  {entity.icon}
                </Box>

                <Box>
                  <Typography
                    fontSize="0.82rem"
                    fontWeight={600}
                    color={active ? "#4f46e5" : "grey.800"}
                    lineHeight={1.3}
                  >
                    {t(entity.labelKey)}
                  </Typography>
                  <Typography fontSize="0.72rem" color="grey.400" mt={0.2}>
                    {t(entity.descKey) || "—"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Form panel */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "grey.200",
            boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Franja + header */}
          <Box sx={{ height: 4, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />
          <Box
            sx={{
              px: 3, py: 1.5,
              borderBottom: "1px solid",
              borderColor: "grey.100",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box sx={{
              width: 28, height: 28, borderRadius: 1.5,
              background: "#EEEDFE",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#534AB7",
            }}>
              {React.cloneElement(entities[selected].icon, { sx: { fontSize: 16 } })}
            </Box>
            <Typography fontSize="0.82rem" fontWeight={600} color="#4f46e5"
              textTransform="uppercase" letterSpacing={0.6}>
              {t(entities[selected].labelKey)}
            </Typography>
          </Box>

          {/* Contenido del formulario */}
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {entities[selected].form}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Forms;