import React from "react";
import { useTranslation } from "react-i18next";
/**
 * @file GenericTable.jsx
 * @description Tabla reutilizable para mostrar datos dinámicos con acciones de edición y eliminación.
 */
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Box,
  TableContainer,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * @component GenericTable
 *
 * @description Tabla genérica reutilizable que soporta:
 * - Renderizado dinámico de columnas
 * - Acciones de editar y eliminar
 * - Soporte para propiedades anidadas (ej: persona.identificacion)
 *
 * @param {Object} props
 * @param {string} props.title - Título de la tabla
 * @param {Array<Object>} props.columns - Definición de columnas
 * @param {Array<Object>} props.rows - Datos a mostrar
 * @param {Function} props.onEdit - Acción al editar fila
 * @param {Function} props.onDelete - Acción al eliminar fila
 */
const GenericTable = ({ title, columns, rows, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const getValue = (obj, path) => {
    return path
      .split(/\.|\[|\]/)
      .filter(Boolean)
      .reduce((acc, key) => {
        return acc ? acc[key] : undefined;
      }, obj);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        width: "95%",
        border: "1.5px solid rgba(99,102,241,0.15)",
        boxShadow:
          "0 0 0 1px rgba(99,102,241,0.08), 0 12px 40px rgba(99,102,241,0.14), 0 2px 8px rgba(0,0,0,0.06)",
        background: "#ffffff",
      }}
    >
      {/* ── Header multicolor ── */}
      <Box
        sx={{
          background:
            "#8b5cf6",
          px: { xs: 2, sm: 3 },
          py: 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "50%",
            background: "rgba(255,255,255,0.10)",
            borderRadius: "0 0 60% 60% / 0 0 40% 40%",
            pointerEvents: "none",
          },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          color="#fff"
          letterSpacing={0.4}
          sx={{
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
            textShadow: "0 1px 6px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        >
          {title}
        </Typography>

      </Box>

      {/* ── Table ── */}
      <TableContainer sx={{ px: { xs: 1, sm: 2 }, pt: 1.5, pb: 1 }}>
        <Table sx={{ width: "100%", tableLayout: "fixed", borderCollapse: "separate", borderSpacing: "0 4px" }}>

          {/* ── Head ── */}
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontSize: { xs: "11px", sm: "12px" },
                    fontWeight: 800,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    width: col.width || "auto",
                    color: "#6366f1",
                    borderBottom: "2px solid rgba(99,102,241,0.2)",
                    pb: 1,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    background: "transparent",
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: 800,
                  textAlign: "center",
                  width: "120px",
                  fontSize: { xs: "11px", sm: "12px" },
                  color: "#6366f1",
                  borderBottom: "2px solid rgba(99,102,241,0.2)",
                  pb: 1,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                }}
              >
                {t("common.acciones")}
              </TableCell>
            </TableRow>
          </TableHead>

          {/* ── Body ── */}
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={i}
                sx={{
                  "& td": {
                    background: i % 2 === 0 ? "#fafafe" : "#ffffff",
                    borderTop: "1.5px solid rgba(99,102,241,0.07)",
                    borderBottom: "1.5px solid rgba(99,102,241,0.07)",
                    "&:first-of-type": {
                      borderLeft: "1.5px solid rgba(99,102,241,0.07)",
                      borderRadius: "10px 0 0 10px",
                    },
                    "&:last-of-type": {
                      borderRight: "1.5px solid rgba(99,102,241,0.07)",
                      borderRadius: "0 10px 10px 0",
                    },
                  },
                  "&:hover td": {
                    background: "rgba(99,102,241,0.05)",
                    borderColor: "rgba(99,102,241,0.18)",
                    transform: "translateX(2px)",
                  },
                  transition: "all 0.15s ease",
                }}
              >
                {columns.map((col, j) => (
                  <TableCell
                    key={j}
                    sx={{
                      fontSize: { xs: "11px", sm: "13px" },
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      width: columns[j].width || "auto",
                      color: "#334155",
                      py: 1,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {typeof row[col.field] === "boolean" ? (
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          background: row[col.field]
                            ? "linear-gradient(135deg,#10b981,#34d399)"
                            : "linear-gradient(135deg,#f43f5e,#fb7185)",
                          color: "#fff",
                          borderRadius: "8px",
                          px: 1,
                          py: 0.2,
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          letterSpacing: 0.3,
                          boxShadow: row[col.field]
                            ? "0 2px 6px rgba(16,185,129,0.35)"
                            : "0 2px 6px rgba(244,63,94,0.35)",
                        }}
                      >
                        {row[col.field] ? t("common.si") : t("common.no")}
                      </Box>
                    ) : (
                      getValue(row, col.field)?.toString()
                    )}
                  </TableCell>
                ))}

                {/* ── Acciones ── */}
                <TableCell sx={{ transition: "all 0.15s ease" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75 }}>
                    <Tooltip title={t("common.editar") ?? "Editar"} arrow>
                      <IconButton
                        onClick={() => onEdit(row)}
                        data-testid={`edit-btn-${row.id}`}
                        size="small"
                        sx={{
                          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          color: "#fff",
                          width: 30,
                          height: 30,
                          boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
                          "&:hover": {
                            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                            boxShadow: "0 4px 12px rgba(99,102,241,0.55)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.18s ease",
                        }}
                      >
                        <EditIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t("common.eliminar") ?? "Eliminar"} arrow>
                      <IconButton
                        onClick={() => onDelete(row.id)}
                        data-testid={`delete-btn-${row.id}`}
                        size="small"
                        sx={{
                          background: "linear-gradient(135deg,#f43f5e,#fb7185)",
                          color: "#fff",
                          width: 30,
                          height: 30,
                          boxShadow: "0 2px 8px rgba(244,63,94,0.4)",
                          "&:hover": {
                            background: "linear-gradient(135deg,#e11d48,#f43f5e)",
                            boxShadow: "0 4px 12px rgba(244,63,94,0.55)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.18s ease",
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            {/* Estado vacío */}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align="center"
                  sx={{
                    py: 4,
                    color: "#94a3b8",
                    fontSize: "0.85rem",
                    fontStyle: "italic",
                    border: "none",
                  }}
                >
                  {t("common.sinDatos") ?? "Sin datos para mostrar"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </Paper>
  );
};

export default GenericTable;