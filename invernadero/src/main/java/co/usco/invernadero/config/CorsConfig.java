package co.usco.invernadero.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Configuracion cors (conexion al frontend en react)
 */

/**
 * Clase de configuración encargada de habilitar y personalizar las políticas
 * CORS (Cross-Origin Resource Sharing) dentro de la aplicación.
 *
 * <p>
 * Esta configuración permite que el frontend desarrollado en React pueda
 * realizar solicitudes HTTP al backend sin restricciones de origen,
 * habilitando todos los dominios, métodos y cabeceras.
 * </p>
 *
 * <p>
 * Es especialmente útil durante el desarrollo y pruebas de integración
 * entre cliente y servidor.
 * </p>
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */
@Configuration
public class CorsConfig {

    /**
     * Define un bean de tipo {@link WebMvcConfigurer} para configurar
     * los permisos CORS globales de la aplicación.
     *
     * <p>
     * Se autoriza el acceso a todos los endpoints disponibles,
     * permitiendo cualquier origen, método HTTP y cabecera.
     * </p>
     *
     * @return instancia personalizada de {@link WebMvcConfigurer}
     *         con la configuración CORS habilitada.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            /**
             * Registra las reglas de mapeo CORS para todas las rutas del sistema.
             *
             * @param registry objeto encargado de almacenar la configuración CORS
             *                 aplicada a los endpoints.
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }
}