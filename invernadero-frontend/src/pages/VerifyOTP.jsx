/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  InputBase,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { verifyOtpRequest } from "../api/authApi";
import { useTranslation } from "react-i18next";
import { saveToken } from "../utils/auth";

/**
 * @file VerifyOTP.jsx
 * @description Página de verificación de código OTP.
 */
const OTP_LENGTH = 6;

const VerifyOTP = () => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError(t("otp.incorrecto"));
      return;
    }
    try {
      const data = { username: localStorage.getItem("username"), code };
      const response = await verifyOtpRequest(data);
      saveToken(response.token);
      navigate("/mIPerfil");
    } catch (err) {
      setError(t("otp.incorrecto"));
    }
  };

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
        {/* Icon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
            }}
          >
            <LockOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          color="grey.900"
          letterSpacing="-0.5px"
          mb={0.75}
        >
          {t("otp.verificar")}
        </Typography>
        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2, fontSize: "0.8rem" }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* OTP boxes */}
        <Box
          component="form"
          onSubmit={handleVerifyOtp}
          onPaste={handlePaste}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              mb: 4,
            }}
          >
            {digits.map((digit, i) => (
              <Box
                key={i}
                sx={{
                  width: 52,
                  height: 60,
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: digit ? "#4f46e5" : "grey.300",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 0.2s",
                  "&:focus-within": {
                    borderColor: "#4f46e5",
                    boxShadow: "0 0 0 3px rgba(79,70,229,0.15)",
                  },
                }}
              >
                <InputBase
                  inputRef={(el) => (inputsRef.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#1e1b4b",
                      padding: 0,
                      width: "100%",
                    },
                  }}
                  sx={{ width: "100%" }}
                />
              </Box>
            ))}
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
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
            {t("otp.verficarCodigo")}
          </Button>
        </Box>

        {/* Back link */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography
            variant="body2"
            color="grey.500"
            sx={{
              "& span": {
                color: "#4f46e5",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              },
            }}
          >
            ¿No recibiste el código?{" "}
            <span onClick={() => navigate("/login")}>Volver al inicio</span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerifyOTP;