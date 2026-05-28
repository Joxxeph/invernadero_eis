import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Stack,
  ButtonBase,
  Drawer,
  List,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import DynamicFormOutlinedIcon from "@mui/icons-material/DynamicFormOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * @component Menu
 * @description Layout principal con navegación en la barra superior.
 */
const Menu = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { text: t("menu.diagramaDB"),  path: "/diagrama", icon: <AccountTreeOutlinedIcon fontSize="small" /> },
    { text: t("menu.formularios"), path: "/formulariosBD",   icon: <DynamicFormOutlinedIcon fontSize="small" /> },
    { text: t("menu.entidades"),       path: "/informacionEntidades",    icon: <TableChartOutlinedIcon fontSize="small" /> },
    { text: t("menu.perfil"),      path: "/miPerfil",  icon: <PersonOutlineIcon fontSize="small" /> },
  ];

  const NavItem = ({ item, onClick }) => {
    const active = location.pathname === item.path;
    return (
      <ButtonBase
        onClick={() => {
          navigate(item.path);
          onClick?.();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.75,
          py: 0.75,
          borderRadius: 2,
          fontFamily: "inherit",
          fontSize: "0.85rem",
          fontWeight: active ? 700 : 500,
          color: active ? "#fff" : "rgba(255,255,255,0.7)",
          background: active ? "rgba(255,255,255,0.18)" : "transparent",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
          "&:hover": {
            background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)",
            color: "#fff",
          },
          "& svg": {
            color: active ? "#fff" : "rgba(255,255,255,0.6)",
            fontSize: "1rem",
          },
        }}
      >
        {item.icon}
        {item.text}
        {active && (
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#fff",
              opacity: 0.85,
              ml: 0.5,
            }}
          />
        )}
      </ButtonBase>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* TOP NAV */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
          boxShadow: "0 2px 20px rgba(79,70,229,0.25)",
          zIndex: 1300,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          {/* Logo + title */}
          <Stack direction="row" alignItems="center" gap={1.25} flexShrink={0}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocalFloristOutlinedIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="#fff"
              letterSpacing="-0.3px"
              noWrap
            >
              {t("common.invernaderoTitulo")}
            </Typography>
          </Stack>

          {/* Nav links — desktop */}
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1, ml: 3 }}
          >
            {menuItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </Stack>

          {/* Right: language + hamburger */}
          <Stack direction="row" alignItems="center" gap={1.5} flexShrink={0}>
            <LanguageSwitcher />
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: "none" }, color: "#fff" }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER (slides from top) */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { md: "none" },
          "& .MuiDrawer-paper": {
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            pt: 9,
            pb: 2,
            px: 2,
          },
        }}
      >
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Menu;