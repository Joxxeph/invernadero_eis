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
 * Propósito: Entidad encargada de clasificar y parametrizar los diferentes
 * tipos de cultivos manejados por el sistema, definiendo características
 * agronómicas y de temporalidad.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que parametriza los tipos de cultivo existentes")
public class TipoCultivo {




    /**
     * Identificador único del tipo de cultivo
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del tipo de cultivo", example = "1")



    private Long id;


    /**
     * Nombre del tipo de cultivo
     */


    @NotNull
    @Schema(description = "Nombre del tipo de cultivo", example = "Tomate")

    private String nombre;


    /**
     * Descripción detallada del tipo de cultivo
     */

    @Schema(description = "Descripción del tipo de cultivo", example = "Cultivo de hortaliza de clima templado")

    private String descripcion;


    /**
     * Clasificación (hortalizas, frutas, aromáticas, etc.)
     */
    @Schema(description = "Clasificación del cultivo", example = "Hortaliza")


    private String clasificacion;


    /**
     * Tiempo promedio de cosecha en días
     */

    @Schema(description = "Tiempo promedio de cosecha en días", example = "90")

    private Integer tiempo_cosecha_dias;


    /**
     * Temporada recomendada para el cultivo
     */

    @Schema(description = "Temporada recomendada", example = "Primavera")

    private String temporada;


    /**
     * Indica si el tipo de cultivo está activo
     */


    @NotNull
    @Schema(description = "Indica si el tipo de cultivo está activo", example = "true")

    private Boolean activo;



}