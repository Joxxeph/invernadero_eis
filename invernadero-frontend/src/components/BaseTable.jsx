import React from "react";
import { Handle, Position } from "reactflow";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  Typography,
  Box,
  ButtonBase,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NumbersIcon from "@mui/icons-material/Numbers";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import DataObjectIcon from "@mui/icons-material/DataObject";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

/**
 * Devuelve color e ícono según el tipo de campo SQL
 */
const getTypeStyle = (type = "") => {
  const t = type.toUpperCase();
  if (["INT", "BIGINT", "INTEGER", "SMALLINT", "SERIAL", "LONG", "FLOAT", "DOUBLE", "DECIMAL", "NUMERIC"].some(k => t.includes(k)))
    return { bg: "#fef3c7", color: "#b45309", icon: <NumbersIcon sx={{ fontSize: 12 }} /> };
  if (["VARCHAR", "TEXT", "CHAR", "STRING", "CLOB", "NVARCHAR"].some(k => t.includes(k)))
    return { bg: "#d1fae5", color: "#047857", icon: <TextFieldsIcon sx={{ fontSize: 12 }} /> };
  if (["DATE", "TIME", "TIMESTAMP", "DATETIME"].some(k => t.includes(k)))
    return { bg: "#e0e7ff", color: "#4338ca", icon: <CalendarMonthIcon sx={{ fontSize: 12 }} /> };
  if (["BOOL", "BOOLEAN", "BIT"].some(k => t.includes(k)))
    return { bg: "#fce7f3", color: "#be185d", icon: <ToggleOnIcon sx={{ fontSize: 12 }} /> };
  if (["JSON", "JSONB", "BLOB", "BINARY", "BYTEA"].some(k => t.includes(k)))
    return { bg: "#f3e8ff", color: "#7e22ce", icon: <DataObjectIcon sx={{ fontSize: 12 }} /> };
  return { bg: "#f1f5f9", color: "#475569", icon: <HelpOutlineIcon sx={{ fontSize: 12 }} /> };
};

/**
 * @component BaseTable
 * @description Tarjeta de entidad con campos coloreados por tipo de dato.
 */
const BaseTable = ({ data }) => {
  const expanded = data.expanded;
  const visibleFields = expanded ? data.fields : data.fields.slice(0, 6);
  const { t } = useTranslation();

  return (
    <Card
      elevation={0}
      sx={{
        width: 260,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #e0e7ff",
        boxShadow: "0 8px 28px rgba(79,70,229,0.14)",
        background: "#fff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
          px: 1.5,
          py: 1.1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color="#fff"
          letterSpacing={0.3}
          noWrap
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          {data.entityName}
        </Typography>
        <Box
          sx={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: 1,
            px: 0.75,
            py: 0.15,
            fontSize: "0.65rem",
            color: "#fff",
            fontWeight: 700,
            flexShrink: 0,
            ml: 1,
          }}
        >
          {data.fields.length}
        </Box>
      </Box>

      {/* Fields */}
      <CardContent sx={{ p: "6px !important", pb: "4px !important" }}>
        {visibleFields.map((field, index) => {
          const typeStyle = getTypeStyle(field.type);
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.45,
                px: 0.75,
                mb: 0.3,
                borderRadius: 1.5,
                background: field.primaryKey ? "rgba(245,158,11,0.08)" : "#fafafa",
                border: "1px solid",
                borderColor: field.primaryKey ? "rgba(245,158,11,0.25)" : "#f0f0f8",
                "&:hover": { background: field.primaryKey ? "rgba(245,158,11,0.12)" : "#f5f3ff" },
                transition: "background 0.15s",
              }}
            >
              {/* Field name + PK icon */}
              <Box display="flex" alignItems="center" gap={0.6}>
                {field.primaryKey ? (
                  <KeyIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
                ) : (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: typeStyle.color,
                      opacity: 0.6,
                      flexShrink: 0,
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  fontWeight={field.primaryKey ? 700 : 500}
                  color={field.primaryKey ? "#b45309" : "grey.700"}
                  sx={{ fontSize: "0.72rem" }}
                >
                  {field.name}
                </Typography>
              </Box>

              {/* Type badge */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                  background: typeStyle.bg,
                  color: typeStyle.color,
                  borderRadius: 1,
                  px: 0.75,
                  py: 0.15,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  flexShrink: 0,
                  maxWidth: 90,
                  overflow: "hidden",
                }}
              >
                {typeStyle.icon}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {field.type}
                </span>
              </Box>
            </Box>
          );
        })}

        {/* Expand / collapse */}
        {data.fields.length > 6 && (
          <ButtonBase
            onClick={() => data.toggleNode(data.entityName)}
            sx={{
              width: "100%",
              mt: 0.5,
              py: 0.7,
              borderRadius: 1.5,
              fontSize: "0.72rem",
              fontWeight: 600,
              fontFamily: "inherit",
              color: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              background: "rgba(79,70,229,0.05)",
              border: "1px dashed #c4b5fd",
              "&:hover": { background: "rgba(79,70,229,0.10)" },
              transition: "background 0.2s",
            }}
          >
            {expanded ? (
              <><ExpandLessIcon sx={{ fontSize: 14 }} />{t("common.verMenos")}</>
            ) : (
              <><ExpandMoreIcon sx={{ fontSize: 14 }} />{`${t("common.ver")} ${data.fields.length - 6} ${t("common.camposMas")}`}</>
            )}
          </ButtonBase>
        )}
      </CardContent>

      {/* Legend */}
      <Box
        sx={{
          px: 1.25,
          py: 0.75,
          borderTop: "1px solid #f0f0f8",
          display: "flex",
          flexWrap: "wrap",
          gap: 0.6,
        }}
      >
        {[
          { label: "NUM", bg: "#fef3c7", color: "#b45309" },
          { label: "TXT", bg: "#d1fae5", color: "#047857" },
          { label: "DATE", bg: "#e0e7ff", color: "#4338ca" },
          { label: "BOOL", bg: "#fce7f3", color: "#be185d" },
          { label: "JSON", bg: "#f3e8ff", color: "#7e22ce" },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              background: item.bg,
              color: item.color,
              borderRadius: 0.75,
              px: 0.6,
              py: 0.1,
              fontSize: "0.58rem",
              fontWeight: 700,
            }}
          >
            {item.label}
          </Box>
        ))}
      </Box>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#7c3aed", width: 8, height: 8, border: "2px solid #fff" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#4f46e5", width: 8, height: 8, border: "2px solid #fff" }}
      />
    </Card>
  );
};

export default BaseTable;
