package co.usco.invernadero.security;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Maneja los intentos de acceso no autenticado a endpoints protegidos.
 * Retorna una respuesta HTTP 401 (Unauthorized) cuando el usuario no ha iniciado sesión
 * o el token no es válido.
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    /**
     * Se ejecuta cuando un usuario intenta acceder a un recurso protegido sin autenticación válida.
     *
     * @param request solicitud HTTP
     * @param response respuesta HTTP
     * @param authException excepción de autenticación generada
     */
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException)
            throws IOException, ServletException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        response.getWriter().write("""
            {
              "error": "NOT_AUTH"
            }
        """);
    }
}