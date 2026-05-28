package co.usco.invernadero.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: DTO utilizado para encapsular las credenciales enviadas por el usuario
 * durante el proceso de autenticación en el sistema.
 */
@Data
@Schema(description = "DTO que contiene las credenciales necesarias para iniciar sesión")
public class LoginRequest {

    /**
     * Nombre de usuario registrado en el sistema.
     */
    @Schema(description = "Nombre de usuario para autenticación", example = "admin")
    private String username;
 
    /**
     * Contraseña asociada a la cuenta del usuario.
     */
    @Schema(description = "Contraseña del usuario", example = "Admin123*")
    private String password;
}