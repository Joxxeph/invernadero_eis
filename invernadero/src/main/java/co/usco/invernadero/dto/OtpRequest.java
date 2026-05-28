package co.usco.invernadero.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: DTO utilizado para recibir la información necesaria
 * para la validación del código OTP de doble autenticación.
 */
@Data
@Schema(description = "DTO para validar el código OTP ingresado por el usuario")
public class OtpRequest {

    /**
     * Nombre del usuario que realiza la validación.
     */
    @Schema(description = "Nombre del usuario autenticado", example = "admin")
    private String username;
    /**
     * Código OTP temporal suministrado para completar la autenticación.
     */
    @Schema(description = "Código OTP generado", example = "458921")
    private String code;
}
