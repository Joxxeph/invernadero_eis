package co.usco.invernadero.security;

import co.usco.invernadero.model.Usuario;
import co.usco.invernadero.repository.UsuarioRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Maneja el flujo de autenticación exitoso mediante OAuth2,
 * creando o recuperando el usuario y generando un token JWT.
 */
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(UsuarioRepository usuarioRepository,
                                JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");

        Usuario usuario = usuarioRepository.findByUsername(email)
                .orElseGet(() -> {
                    Usuario nuevo = new Usuario();
                    nuevo.setUsername(email);
                    nuevo.setPassword("OAUTH_USER");
                    nuevo.setRol(Rol.USER);
                    nuevo.setActivo(true);
                    return usuarioRepository.save(nuevo);
                });

        String token = jwtService.generateToken(usuario.getUsername(), usuario.getRol());

        response.sendRedirect("http://localhost:5173/oauth-success?token=" + token);
    }
}