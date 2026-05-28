package co.usco.invernadero.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: DTO encargado de transportar el token JWT generado
 * luego de una autenticación exitosa del usuario.
 */
@Schema(description = "DTO que retorna el token de autenticación generado por el sistema")
public class LoginResponse {
    /**
     * Token JWT emitido para permitir el acceso a recursos protegidos.
     */
    @Schema(description = "Token de autenticación JWT", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;

    /**
     * Constructor parametrizado para inicializar el token de respuesta.
     *
     * @param token token JWT generado tras el inicio de sesión exitoso
     */
    public LoginResponse(String token) {
        this.token = token;
    }

    /**
     * Obtiene el token JWT generado.
     *
     * @return cadena correspondiente al token de autenticación
     */
    public String getToken() {
        return token;
    }
    
    /**
     * Establece un nuevo valor para el token JWT.
     *
     * @param token token de autenticación a asignar
     */
    public void setToken(String token) {
        this.token = token;
    }
}