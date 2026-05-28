package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;
import java.math.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad Cultivo generada automáticamente
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cultivo {




    /**
     * Identificador único del cultivo
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @NotNull

    private Long id;


    /**
     * Identificador del tipo de cultivo (FK)
     */


    @NotNull

    private Integer id_tipo_cultivo;


    /**
     * Nombre del cultivo
     */


    @NotNull

    private String nombre;


    /**
     * Descripción del cultivo
     */


    private String descripcion;


    /**
     * Fecha de siembra
     */


    @NotNull

    private LocalDate fecha_siembra;


    /**
     * Fecha estimada de cosecha
     */


    private LocalDate fecha_estimada_cosecha;


    /**
     * Fecha real de cosecha
     */


    private LocalDate fecha_cosecha;


    /**
     * Área sembrada en metros cuadrados
     */


    @NotNull

    private BigDecimal area_sembrada;


    /**
     * Cantidad de plantas o semillas sembradas
     */


    @NotNull

    private Integer cantidad_sembrada;


    /**
     * Rendimiento estimado en kilogramos
     */


    private BigDecimal rendimiento_estimado;


    /**
     * Estado del cultivo (planeado, activo, cosechado, cancelado)
     */


    @NotNull

    private String estado;


    /**
     * Indica si el cultivo está activo
     */


    @NotNull

    private Boolean activo;



    /**
     * Relación ManyToOne con TipoCultivo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_cultivo", insertable=false, updatable=false)
    private TipoCultivo tipo_cultivo;

}