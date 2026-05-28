package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;
import java.math.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad TipoCultivo generada automáticamente
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoCultivo {




    /**
     * Identificador único del tipo de cultivo
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;


    /**
     * Nombre del tipo de cultivo
     */


    @NotNull

    private String nombre;


    /**
     * Descripción detallada del tipo de cultivo
     */


    private String descripcion;


    /**
     * Clasificación (hortalizas, frutas, aromáticas, etc.)
     */


    private String clasificacion;


    /**
     * Tiempo promedio de cosecha en días
     */


    private Integer tiempo_cosecha_dias;


    /**
     * Temporada recomendada para el cultivo
     */


    private String temporada;


    /**
     * Indica si el tipo de cultivo está activo
     */


    @NotNull

    private Boolean activo;



}