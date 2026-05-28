import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { useTranslation } from "react-i18next";
/**
 * @file OAuthPage.jsx
 * @description Página de redirección para autenticación OAuth2.
 * Recibe el token desde la URL y lo almacena en el sistema.
 *
 * @component
 * @returns {JSX.Element} Mensaje de autenticación en proceso.
 */
export default function OAuthPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      saveToken(token);
      navigate("/perfil");
    } else {
      navigate("/login");
    }
  }, []);

  return <p>{t("inicio.autenticando")}</p>;
}