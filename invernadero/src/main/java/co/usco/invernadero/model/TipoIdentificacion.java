package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;
import java.math.*;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad encargada de parametrizar los distintos tipos
 * de documentos de identificación aceptados dentro del sistema. 
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que almacena los tipos de identificación válidos")

public class TipoIdentificacion {




    /**
     * Identificador único del tipo de identificación
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del tipo de identificación", example = "1")


    private Long id;


    /**
     * Nombre del tipo de identificación (Cédula, NIT, Pasaporte, etc.)
     */


    @NotNull
    @Schema(description = "Nombre del tipo de identificación", example = "Cédula de Ciudadanía")

    private String nombre;


    /**
     * Abreviatura del tipo de identificación (CC, NIT, PAS, etc.)
     */


    @NotNull
    @Schema(description = "Abreviatura del tipo de identificación", example = "CC")

    private String abreviatura;


    /**
     * Indica si el tipo de identificación está activo
     */


    @NotNull
    @Schema(description = "Indica si el tipo de identificación está activo", example = "true")

    private Boolean activo;



}