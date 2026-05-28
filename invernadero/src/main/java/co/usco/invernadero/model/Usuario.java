package co.usco.invernadero.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import co.usco.invernadero.security.Rol;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad encargada de representar los usuarios autenticables
 * del sistema. Implementa la interfaz UserDetails de Spring Security para
 * integrarse con el mecanismo de autenticación y autorización basado en JWT.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuarios")
@Schema(description = "Entidad que almacena la información de autenticación y autorización de usuarios")
public class Usuario implements UserDetails {
    /**
     * Identificador único del usuario
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del usuario", example = "1")
    private Long id;
    /**
     * Nombre del usuario 
     */

    @Column(unique = true, nullable = false)
    @Schema(description = "Nombre de usuario único", example = "admin")

    private String username;
    /**
     * contraseña encriptada del usuario
     */

    @Column(nullable = false, length = 100)
    @Schema(description = "Contraseña encriptada del usuario")

    private String password;
    /**
     * Rol del usuario
     */

    @Enumerated(EnumType.STRING)    
    @Schema(description = "Rol asignado al usuario dentro del sistema")

    private Rol rol;
    /**
     * Estado activo del usuario
     */
    @Schema(description = "Indica si el usuario se encuentra activo", example = "true")

    private Boolean activo = true;

    /**
     * Obtiene los permisos o autoridades concedidas al usuario autenticado.
     *
     * @return colección de autoridades basadas en el rol asignado
     */

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    /**
     * Indica si la cuenta del usuario no ha expirado.
     *
     * @return true si la cuenta está vigente
     */
    @Override
    public boolean isAccountNonExpired() {
        return activo;
    }
    /**
     * Indica si la cuenta del usuario no está bloqueada.
     *
     * @return true si la cuenta está habilitada
     */

    @Override
    public boolean isAccountNonLocked() {
        return activo;
    }
    /**
     * Indica si las credenciales del usuario siguen siendo válidas.
     *
     * @return true si la contraseña no ha expirado
     */

    @Override
    public boolean isCredentialsNonExpired() {
        return activo;
    }
    /**
     * Determina si el usuario está habilitado para autenticarse.
     *
     * @return true si el usuario está activo
     */

    @Override
    public boolean isEnabled() {
        return activo;
    }
}