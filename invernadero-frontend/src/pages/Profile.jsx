/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  Divider,
  Skeleton,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutRequest, perfilRequest } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import { useTranslation } from "react-i18next";

/**
 * @file Profile.jsx
 * @description Página de perfil del usuario autenticado.
 */
const InfoRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      py: 1.75,
    }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: 2,
        background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 20, color: "#4f46e5" } })}
    </Box>
    <Box>
      <Typography variant="caption" color="grey.500" fontWeight={500} display="block">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600} color="grey.800">
        {value}
      </Typography>
    </Box>
  </Box>
);

const Profile = () => {
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await perfilRequest();
        setPerfil(data);
      } catch (err) {
        console.log("ERROR COMPLETO:", err);
      }
    };
    fetchPerfil();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const initials = perfil?.username
    ? perfil.username.slice(0, 2).toUpperCase()
    : "?";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          p: { xs: 4, sm: 5 },
          border: "1px solid",
          borderColor: "grey.200",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          background: "#fff",
        }}
      >
        {/* Avatar */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              fontSize: "1.6rem",
              fontWeight: 700,
              boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
              mb: 1.5,
            }}
          >
            {!perfil ? "?" : initials}
          </Avatar>

          {!perfil ? (
            <Skeleton width={140} height={28} sx={{ borderRadius: 1 }} />
          ) : (
            <Typography
              variant="h6"
              fontWeight={700}
              color="grey.900"
              letterSpacing="-0.3px"
            >
              {perfil.username}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Info rows */}
        {!perfil ? (
          <>
            <Skeleton variant="rounded" height={56} sx={{ mb: 1.5, borderRadius: 2 }} />
            <Skeleton variant="rounded" height={56} sx={{ mb: 1.5, borderRadius: 2 }} />
          </>
        ) : (
          <>
            <InfoRow
              icon={<BadgeOutlinedIcon />}
              label={t("inicio.rol")}
              value={perfil.rol}
            />
            <Divider />
            <InfoRow
              icon={<ToggleOnOutlinedIcon />}
              label={t("inicio.estado")}
              value={
                <Chip
                  label={perfil.activo ? t("inicio.activo") : t("inicio.inactivo")}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    background: perfil.activo
                      ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
                      : "linear-gradient(135deg, #fee2e2, #fecaca)",
                    color: perfil.activo ? "#065f46" : "#991b1b",
                    border: "none",
                  }}
                />
              }
            />
          </>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Logout button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: "0.95rem",
            textTransform: "none",
            letterSpacing: 0.2,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338ca, #6d28d9)",
              boxShadow: "0 6px 20px rgba(79,70,229,0.45)",
            },
          }}
        >
          {t("inicio.cerrar")}
        </Button>
      </Paper>
    </Box>
  );
};

export default Profile;