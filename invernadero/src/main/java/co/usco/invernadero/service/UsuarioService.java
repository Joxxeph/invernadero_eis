package co.usco.invernadero.service;

import java.util.List;

import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import co.usco.invernadero.dto.RegisterRequest;
import co.usco.invernadero.exception.BusinessException;
import co.usco.invernadero.model.Usuario;
import co.usco.invernadero.repository.UsuarioRepository;
import co.usco.invernadero.security.Rol;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para Usuario
 */
@Service
public class UsuarioService {

    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final MessageSource messageSource;
    public UsuarioService(UsuarioRepository repo, PasswordEncoder passwordEncoder, MessageSource messageSource
) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.messageSource = messageSource;

    }

    // crear usuario con password encriptada
    public Usuario save(Usuario usuario) {
        usuario.setPassword(
            passwordEncoder.encode(usuario.getPassword())
        );
        return repo.save(usuario);
    }

    public List<Usuario> findAll() {
        return repo.findAll();
    }

    public Usuario findByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("user.not.found"));
    }

    public Usuario getByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("user.not.found"));
    }

    public Usuario register(RegisterRequest request) {

        Usuario usuario = new Usuario();

        usuario.setUsername(request.getUsername());

        // 🔐 encriptación obligatoria
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));

        usuario.setRol(request.getRol() != null ? request.getRol() : Rol.USER);

        usuario.setActivo(true);

        return repo.save(usuario);
    }
}