import { Box, ButtonBase } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * @file LanguageSwitcher.jsx
 * @description Componente para cambiar el idioma de la aplicación.
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2);

  const langs = ["ES", "EN"];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: "#f0f0f8",
        borderRadius: 2,
        p: 0.5,
        gap: 0.5,
      }}
    >
      {langs.map((lang) => {
        const active = current === lang.toLowerCase();
        return (
          <ButtonBase
            key={lang}
            onClick={() => i18n.changeLanguage(lang.toLowerCase())}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              fontSize: "0.75rem",
              fontWeight: 700,
              fontFamily: "inherit",
              letterSpacing: 0.5,
              transition: "all 0.2s",
              color: active ? "#fff" : "#6b7280",
              background: active
                ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                : "transparent",
              boxShadow: active ? "0 2px 8px rgba(79,70,229,0.3)" : "none",
              "&:hover": {
                color: active ? "#fff" : "#4f46e5",
                background: active
                  ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                  : "rgba(79,70,229,0.08)",
              },
            }}
          >
            {lang}
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default LanguageSwitcher;