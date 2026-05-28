package co.usco.invernadero.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Congguracion doocumentación
 */


/**
 * Clase de configuración responsable de personalizar la documentación
 * OpenAPI/Swagger de la API REST del sistema Invernadero.
 *
 * <p>
 * Define la información general de la API, como el título, versión
 * y descripción, además de establecer el esquema de seguridad basado
 * en autenticación JWT mediante Bearer Token.
 * </p>
 *
 * <p>
 * Gracias a esta configuración, Swagger UI podrá mostrar la opción
 * de autenticación para consumir endpoints protegidos.
 * </p>
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */

@Configuration
public class OpenApiConfig {
    /**
     * Crea y personaliza la instancia principal de OpenAPI utilizada
     * por Swagger para generar la documentación interactiva del backend.
     *
     * <p>
     * Se configura:
     * </p>
     * <ul>
     *     <li>Título de la API</li>
     *     <li>Versión del sistema</li>
     *     <li>Descripción general</li>
     *     <li>Esquema de autenticación JWT Bearer</li>
     * </ul>
     *
     * @return objeto {@link OpenAPI} con la configuración personalizada
     *         de documentación y seguridad.
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Invernadero Electiva ingenieria de software")
                        .version("1.0")
                        .description("Documentación API backend"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        ));
    }
}