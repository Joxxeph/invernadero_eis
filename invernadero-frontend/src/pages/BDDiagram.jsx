import React from "react";
import Diagram from "../components/Diagram";
import { Box, Paper, Typography, Container } from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { useTranslation } from "react-i18next";

/**
 * @file BDDiagram.jsx
 * @description Página que muestra el diagrama del sistema.
 */
const BDDiagram = () => {
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
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
              flexShrink: 0,
            }}
          >
            <AccountTreeOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color="grey.900"
              letterSpacing="-0.5px"
            >
              {t("common.diagrama")}
            </Typography>
          </Box>
        </Box>

        {/* Diagram card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "grey.200",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Top bar */}
          <Box
            sx={{
              px: 3,
              py: 1.5,
              borderBottom: "1px solid",
              borderColor: "grey.100",
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: "linear-gradient(135deg, #fafafa, #f5f3ff)",
            }}
          >
            {["#f87171", "#fbbf24", "#34d399"].map((color) => (
              <Box
                key={color}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                  opacity: 0.8,
                }}
              />
            ))}
            <Typography
              variant="caption"
              color="grey.400"
              fontWeight={500}
              ml={1}
            >
              {t("common.diagrama")}
            </Typography>
          </Box>

          {/* Diagram */}
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Diagram />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BDDiagram;