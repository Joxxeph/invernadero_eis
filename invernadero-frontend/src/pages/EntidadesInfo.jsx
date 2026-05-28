import React, { useState } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import TipoCultivoTable from "../components/TipoCultivoTable";
import CultivoTable from "../components/CultivoTable";
import ProductoTable from "../components/ProductoTable";
import TipoIdentificacionTable from "../components/TipoIdentificacionTable";
import PersonaTable from "../components/PersonaTable";
import ClienteTable from "../components/ClienteTable";

const entities = [
  {
    labelKey: "common.tipoCultivo",
    icon: <GrassOutlinedIcon sx={{ fontSize: 18 }} />,
    table: <TipoCultivoTable />,
  },
  {
    labelKey: "common.cultivo",
    icon: <AgricultureOutlinedIcon sx={{ fontSize: 18 }} />,
    table: <CultivoTable />,
  },
  {
    labelKey: "common.producto",
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />,
    table: <ProductoTable />,
  },
  {
    labelKey: "common.tipoIdent",
    icon: <BadgeOutlinedIcon sx={{ fontSize: 18 }} />,
    table: <TipoIdentificacionTable />,
  },
  {
    labelKey: "common.persona",
    icon: <PersonOutlineIcon sx={{ fontSize: 18 }} />,
    table: <PersonaTable />,
  },
  {
    labelKey: "common.cliente",
    icon: <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />,
    table: <ClienteTable />,
  },
];

const EntidadesInfo = () => {
  const [selected, setSelected] = useState(0);
  const { t } = useTranslation();

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>

      {/* Selector label */}
      <Typography
        variant="caption"
        fontWeight={700}
        color="#4f46e5"
        textTransform="uppercase"
        letterSpacing={0.8}
        display="block"
        mb={1.5}
        mt={1}
      >
        {t("common.seleccionaEntidad")}
      </Typography>

      {/* Entity cards grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
          gap: 1.25,
          mb: 2.5,
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
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                background: "#fff",
                border: active ? "1.5px solid #4f46e5" : "0.5px solid",
                borderColor: active ? "#4f46e5" : "grey.200",
                borderRadius: 3,
                px: 1.5,
                py: 1.25,
                cursor: "pointer",
                boxShadow: active ? "0 0 0 3px rgba(79,70,229,0.12)" : "none",
                transition: "all 0.18s",
                "&:hover": {
                  borderColor: "#7c3aed",
                  boxShadow: "0 0 0 3px rgba(79,70,229,0.08)",
                },
              }}
            >
              {/* Dot activo */}
              {active && (
                <Box sx={{
                  position: "absolute", top: 8, right: 8,
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#4f46e5",
                }} />
              )}

              {/* Ícono */}
              <Box sx={{
                width: 32, height: 32, borderRadius: 2, flexShrink: 0,
                background: active ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "#EEEDFE",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: active ? "#fff" : "#534AB7",
                boxShadow: active ? "0 3px 8px rgba(79,70,229,0.28)" : "none",
                transition: "all 0.18s",
              }}>
                {entity.icon}
              </Box>

              <Typography
                fontSize="0.78rem"
                fontWeight={500}
                color={active ? "#4f46e5" : "grey.700"}
                lineHeight={1.3}
              >
                {t(entity.labelKey)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Table panel */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 3,
          border: "0.5px solid",
          borderColor: "grey.200",
          overflow: "hidden",
          minHeight: "50vh",
        }}
      >
        {/* Franja + header */}
        <Box sx={{ height: 4, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />
        <Box sx={{
          px: 2.5, py: 1.5,
          borderBottom: "0.5px solid",
          borderColor: "grey.100",
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}>
          <Box sx={{
            width: 28, height: 28, borderRadius: 1.5,
            background: "#EEEDFE",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#534AB7",
          }}>
            {React.cloneElement(entities[selected].icon, { sx: { fontSize: 15 } })}
          </Box>
          <Typography fontSize="0.78rem" fontWeight={700} color="#4f46e5"
            textTransform="uppercase" letterSpacing={0.6}>
            {t(entities[selected].labelKey)}
          </Typography>
        </Box>

        {/* Tabla activa */}
        <Box sx={{ p: { xs: 1.5, sm: 2.5 }, width: "100%" }}>
          {entities[selected].table}
        </Box>
      </Paper>

    </Container>
  );
};

export default EntidadesInfo;