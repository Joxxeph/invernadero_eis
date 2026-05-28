/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/authApi";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslation } from "react-i18next";

/**
 * @file Login.jsx
 * @description Página de autenticación del sistema.
 * Permite iniciar sesión con usuario/contraseña o mediante Google OAuth.
 *
 * @component
 * @returns {JSX.Element} Formulario de login con validación y redirección.
 */
const OAUTH_GOOGLE_URL = "http://localhost:8080/oauth2/authorization/google";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = { username, password };
      await loginRequest(data);
      localStorage.setItem("username", username);
      navigate("/verify-otp");
    } catch (err) {
      console.log(err);
      setError(t("inicio.credencialesMal"));
    }
  };

  const handleLoginAOuth = () => {
    window.location.href = OAUTH_GOOGLE_URL;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0d1f12;
          background-image:
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(34, 85, 44, 0.45) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 10%, rgba(21, 60, 30, 0.5) 0%, transparent 55%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle 300px at 10% 50%, rgba(74, 144, 89, 0.08) 0%, transparent 70%),
            radial-gradient(circle 200px at 90% 80%, rgba(90, 160, 100, 0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          margin: 24px;
          background: rgba(15, 30, 18, 0.85);
          border: 1px solid rgba(90, 160, 100, 0.2);
          border-radius: 20px;
          padding: 48px 44px 44px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03) inset,
            0 40px 80px rgba(0, 0, 0, 0.6),
            0 0 60px rgba(40, 110, 55, 0.12);
          animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .leaf-accent {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3a9e55, #2d7a42);
          border-radius: 50% 0 50% 0;
          box-shadow: 0 4px 20px rgba(58, 158, 85, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .leaf-accent svg {
          width: 18px;
          height: 18px;
          fill: rgba(255,255,255,0.9);
        }

        .login-title {
          font-family: 'Playfair Display', serif !important;
          font-size: 28px !important;
          font-weight: 600 !important;
          color: #e8f5e9 !important;
          text-align: center;
          margin-top: 16px !important;
          margin-bottom: 6px !important;
          letter-spacing: -0.3px;
        }

        .login-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(160, 200, 165, 0.55);
          text-align: center;
          margin-bottom: 36px;
          letter-spacing: 0.3px;
        }

        .login-error {
          background: rgba(220, 80, 80, 0.12);
          border: 1px solid rgba(220, 80, 80, 0.3);
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #ff8a80;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
        }

        .login-field .MuiOutlinedInput-root {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          color: #d4edd6;
          transition: background 0.2s;
        }

        .login-field .MuiOutlinedInput-root:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .login-field .MuiOutlinedInput-root.Mui-focused {
          background: rgba(58, 158, 85, 0.08);
        }

        .login-field .MuiOutlinedInput-notchedOutline {
          border-color: rgba(90, 160, 100, 0.2) !important;
          transition: border-color 0.2s;
        }

        .login-field .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
          border-color: rgba(90, 160, 100, 0.4) !important;
        }

        .login-field .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
          border-color: rgba(58, 158, 85, 0.7) !important;
        }

        .login-field .MuiInputLabel-root {
          font-family: 'DM Sans', sans-serif;
          color: rgba(140, 185, 145, 0.6);
          font-size: 14px;
        }

        .login-field .MuiInputLabel-root.Mui-focused {
          color: #5cb870;
        }

        .login-field input {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }

        .login-btn-primary {
          background: linear-gradient(135deg, #3a9e55 0%, #2d7a42 100%) !important;
          border-radius: 12px !important;
          padding: 13px 0 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 15px !important;
          font-weight: 500 !important;
          letter-spacing: 0.3px !important;
          text-transform: none !important;
          box-shadow: 0 4px 20px rgba(45, 122, 66, 0.35) !important;
          transition: all 0.25s ease !important;
        }

        .login-btn-primary:hover {
          background: linear-gradient(135deg, #44b562 0%, #35904e 100%) !important;
          box-shadow: 0 6px 28px rgba(45, 122, 66, 0.5) !important;
          transform: translateY(-1px);
        }

        .login-btn-primary:active {
          transform: translateY(0);
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }

        .login-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(90, 160, 100, 0.15);
        }

        .login-divider-text {
          font-size: 12px;
          color: rgba(140, 185, 145, 0.35);
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
        }

        .login-btn-google {
          border-radius: 12px !important;
          padding: 12px 0 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          text-transform: none !important;
          letter-spacing: 0.2px !important;
          border-color: rgba(90, 160, 100, 0.25) !important;
          color: rgba(180, 220, 185, 0.8) !important;
          transition: all 0.25s ease !important;
        }

        .login-btn-google:hover {
          background: rgba(58, 158, 85, 0.08) !important;
          border-color: rgba(90, 160, 100, 0.45) !important;
          color: #a8deb0 !important;
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">
          {/* Leaf accent top */}
          <div className="leaf-accent">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-5 8"/>
            </svg>
          </div>

          <Typography className="login-title">
            {t("inicio.inicio")}
          </Typography>
          <p className="login-subtitle">Sistema de gestión de invernadero</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label={t("inicio.usuario")}
              variant="outlined"
              inputProps={{ "data-testid": "email-input" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-field"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label={t("inicio.clave")}
              variant="outlined"
              inputProps={{ "data-testid": "password-input" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-field"
              sx={{ marginBottom: 2.5 }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              data-testid="login-btn"
              className="login-btn-primary"
            >
              {t("inicio.inicio")}
            </Button>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">o continúa con</span>
              <div className="login-divider-line" />
            </div>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon sx={{ fontSize: 18 }} />}
              onClick={handleLoginAOuth}
              className="login-btn-google"
            >
              {t("inicio.inicioGoogle")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
