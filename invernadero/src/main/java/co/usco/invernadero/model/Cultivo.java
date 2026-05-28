package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad encargada de representar la planificación, seguimiento
 * y control de los cultivos desarrollados dentro del invernadero,
 * almacenando información productiva, fechas y estado operativo.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que almacena la información general de los cultivos del sistema")
public class Cultivo {




    /**
     * Identificador único del cultivo
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del cultivo", example = "1")



    private Long id;


    /**
     * Identificador del tipo de cultivo (FK)
     */


    @NotNull
    @Schema(description = "Identificador del tipo de cultivo relacionado", example = "2")

    private Integer id_tipo_cultivo;


    /**
     * Nombre del cultivo
     */


    @NotNull
    @Schema(description = "Nombre del cultivo", example = "Tomate Cherry")

    private String nombre;


    /**
     * Descripción del cultivo
     */

    @Schema(description = "Descripción general del cultivo", example = "Cultivo hidropónico de tomate cherry")

    private String descripcion;


    /**
     * Fecha de siembra
     */


    @NotNull
    @Schema(description = "Fecha de siembra", example = "2026-03-01")

    private LocalDate fecha_siembra;


    /**
     * Fecha estimada de cosecha
     */

    @Schema(description = "Fecha estimada de cosecha", example = "2026-06-15")

    private LocalDate fecha_estimada_cosecha;


    /**
     * Fecha real de cosecha
     */

    @Schema(description = "Fecha real de cosecha", example = "2026-06-20")

    private LocalDate fecha_cosecha;


    /**
     * Área sembrada en metros cuadrados
     */


    @NotNull
    @Schema(description = "Área sembrada en metros cuadrados", example = "50.75")

    private BigDecimal area_sembrada;


    /**
     * Cantidad de plantas o semillas sembradas
     */


    @NotNull
    @Schema(description = "Cantidad sembrada", example = "200")

    private Integer cantidad_sembrada;


    /**
     * Rendimiento estimado en kilogramos
     */

    @Schema(description = "Rendimiento estimado en kilogramos", example = "120.50")

    private BigDecimal rendimiento_estimado;


    /**
     * Estado del cultivo (planeado, activo, cosechado, cancelado)
     */


    @NotNull
    @Schema(description = "Estado del cultivo", example = "ACTIVO")

    private String estado;


    /**
     * Indica si el cultivo está activo
     */


    @NotNull
    @Schema(description = "Estado de activación del cultivo", example = "true")

    private Boolean activo;



    /**
     * Relación ManyToOne con TipoCultivo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_cultivo", insertable=false, updatable=false)
    @Schema(description = "Información del tipo de cultivo asociado")

    private TipoCultivo tipo_cultivo;

}