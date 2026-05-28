package co.usco.invernadero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import co.usco.invernadero.model.Usuario;

import java.util.Optional;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Repositorio de Usuario para acceso a datos
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Permite buscar un usuario en la base de datos a partir de su nombre de usuario.
     * Este método es utilizado principalmente en el proceso de autenticación.
     *
     * @param username nombre de usuario a consultar
     * @return Optional con el usuario encontrado o vacío si no existe
     */
    Optional<Usuario> findByUsername(String username);
}