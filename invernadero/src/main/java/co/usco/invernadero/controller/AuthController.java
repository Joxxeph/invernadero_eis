package co.usco.invernadero.controller;

import co.usco.invernadero.dto.LoginRequest;
import co.usco.invernadero.dto.LoginResponse;
import co.usco.invernadero.dto.OtpRequest;
import co.usco.invernadero.dto.RegisterRequest;
import co.usco.invernadero.model.Usuario;
import co.usco.invernadero.security.JwtService;
import co.usco.invernadero.service.UsuarioService;
import co.usco.invernadero.service.EmailService;
import co.usco.invernadero.security.OtpService;
import co.usco.invernadero.security.TokenBlacklistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.core.Authentication;
import org.springframework.context.MessageSource;
import org.springframework.security.access.prepost.PreAuthorize;
import co.usco.invernadero.dto.PerfilResponse;
import java.util.Locale;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Autenticación
 */


/**
 * Controlador REST encargado de administrar todos los procesos
 * de autenticación, autorización y validación de usuarios del sistema.
 *
 * <p>
 * Incluye funcionalidades de:
 * </p>
 * <ul>
 *     <li>Inicio de sesión con credenciales</li>
 *     <li>Verificación mediante código OTP enviado al correo</li>
 *     <li>Registro de nuevos usuarios</li>
 *     <li>Consulta del perfil autenticado</li>
 *     <li>Cierre de sesión con invalidación de token JWT</li>
 * </ul>
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Seguridad", description = "Manejo de usuario y credenciales")
public class AuthController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final OtpService otpService;
    private final TokenBlacklistService tokenBlacklistService;
    private final MessageSource messageSource;
    /**
     * Constructor para la inyección de dependencias del módulo de autenticación.
     *
     * @param usuarioService servicio de gestión de usuarios.
     * @param passwordEncoder codificador/verificador de contraseñas.
     * @param jwtService servicio generador de tokens JWT.
     * @param emailService servicio de envío de correos electrónicos.
     * @param otpService servicio de generación y validación de códigos OTP.
     * @param tokenBlacklistService servicio de invalidación de tokens cerrados.
     */

    public AuthController(UsuarioService usuarioService,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                        EmailService emailService,
                    OtpService otpService,
                TokenBlacklistService tokenBlacklistService,
            MessageSource messageSource) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.otpService = otpService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.messageSource = messageSource;
    
    }   
    /**
     * Valida las credenciales iniciales del usuario y envía un código OTP
     * al correo registrado para completar el proceso de autenticación.
     *
     * @param request credenciales de acceso del usuario.
     * @return mensaje indicando que el código OTP fue enviado.
     */
    @Operation(summary = "Inicio de sesión", description = "Validar las credenciales de un usuario y envíar código OTP al correo del usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Código OTP enviado correctamente"),
            @ApiResponse(responseCode = "401", description = "Credenciales no válidas")
    })
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request, Locale locale) {

        Usuario usuario = usuarioService.findByUsername(request.getUsername());

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException(    messageSource.getMessage(
        "auth.invalid.credentials",
        null,
        locale
            )
        );
        }

        String otp = otpService.generarOtp(usuario.getUsername());

        emailService.enviarCodigo(usuario.getUsername(), otp, locale);

        return messageSource.getMessage(
        "auth.otp.sent",
        null,
        locale
        );
    }

    /**
     * Registra un nuevo usuario dentro del sistema.
     *
     * @param request información de registro del nuevo usuario.
     * @return usuario registrado.
     */

    @Operation(summary = "Registrar un nuevo usuario", description = "Registrar un nuevo usuario en el software")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario registrado correctamente")
    })
    @PostMapping("/register")
    public Usuario register(@RequestBody RegisterRequest request) {
        return usuarioService.register(request);
    }
    /**
     * Verifica el código OTP enviado al correo del usuario y,
     * si es correcto, genera un token JWT de acceso.
     *
     * @param request usuario y código OTP ingresado.
     * @return respuesta con token JWT autenticado.
     */

    @Operation(summary = "Validar un codigo OTP", description = "Verificación d el código OTP para inciar sesión")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OTP validado"),
            @ApiResponse(responseCode = "401", description = "Código OTP no valido")
    })
    @PostMapping("/verify-otp")
    public LoginResponse verifyOtp(@RequestBody OtpRequest request, Locale locale) {

        boolean valido = otpService.validarOtp(
                request.getUsername(),
                request.getCode()
        );

        if (!valido) {
            throw new RuntimeException(      messageSource.getMessage(
        "auth.invalid.credentials",
        null,
        locale
            )
        );
        }

        Usuario usuario = usuarioService.findByUsername(request.getUsername());

        otpService.limpiarOtp(request.getUsername());

        String token = jwtService.generateToken(usuario.getUsername(), usuario.getRol());

        return new LoginResponse(token);
    }
    /**
     * Obtiene la información del usuario actualmente autenticado.
     *
     * @param authentication objeto de autenticación proporcionado por Spring Security.
     * @return datos resumidos del perfil del usuario autenticado.
     */
    @Operation(summary = "Ver perfil de un usuario", description = "Ver os detalles del usuario autenticado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente"),
            @ApiResponse(responseCode = "403", description = "No autorizado")
    })
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/perfil")
    public PerfilResponse perfil(Authentication authentication) {
    System.out.println("Autenticación recibida: " + authentication);

        String username = authentication.getName();

        Usuario usuario = usuarioService.getByUsername(username);

        return new PerfilResponse(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getRol(),
                usuario.getActivo()
        );
    }
    /**
     * Cierra la sesión del usuario invalidando el token JWT actual
     * y almacenándolo en una lista negra para impedir futuros accesos.
     *
     * @param authHeader encabezado Authorization con el token Bearer.
     * @return mensaje de cierre de sesión exitoso.
     */
    @Operation(summary = "Cerrar sesión", description = "Cierra de la sesión actual del usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logout exitoso"),
            @ApiResponse(responseCode = "400", description = "Token inválido")
    })
    @PostMapping("/logout")
    public String logout(@RequestHeader("Authorization") String authHeader, Locale locale) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException(   messageSource.getMessage(
        "auth.invalid.token",
        null,
        locale
            ));
        }

        String token = authHeader.substring(7);

        tokenBlacklistService.blacklistToken(token);

        return messageSource.getMessage(
        "auth.invalid.token",
        null,
        locale
            );
    }
}