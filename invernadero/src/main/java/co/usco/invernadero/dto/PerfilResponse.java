package co.usco.invernadero.dto;

import co.usco.invernadero.security.Rol;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: DTO de respuesta encargado de suministrar la información
 * básica del perfil del usuario autenticado dentro del sistema.
 */
@Data
@AllArgsConstructor
@Schema(description = "DTO que contiene la información del perfil del usuario")
public class PerfilResponse {

    /**
     * Identificador único del usuario.
     */
    @Schema(description = "ID del usuario", example = "1")
    private Long id;

    /**
     * Nombre de usuario registrado.
     */
    @Schema(description = "Nombre del usuario", example = "admin")
    private String username;
    /**
     * Rol asignado dentro del sistema.
     */
    @Schema(description = "Rol del usuario en el sistema")
    private Rol rol;
    /**
     * Estado actual de activación del usuario.
     */
    @Schema(description = "Estado de activación del usuario", example = "true")
    private Boolean activo;
}