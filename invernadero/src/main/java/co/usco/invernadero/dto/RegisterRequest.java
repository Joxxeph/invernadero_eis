package co.usco.invernadero.dto;

import co.usco.invernadero.security.Rol;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: DTO utilizado para encapsular la información requerida
 * en el proceso de registro de nuevos usuarios.
 */
@Data
@Schema(description = "DTO para el registro de usuarios en el sistema")
public class RegisterRequest {

    /**
     * Nombre del nuevo usuario.
     */
    @Schema(description = "Nombre del usuario a registrar", example = "usuario1")
    private String username;

    /**
     * Contraseña de acceso asignada al usuario.
     */
    @Schema(description = "Contraseña del usuario", example = "User123*")
    private String password;
    /**
     * Rol funcional que tendrá el usuario dentro de la aplicación.
     */
    @Schema(description = "Rol asignado al usuario")
    private Rol rol;
}