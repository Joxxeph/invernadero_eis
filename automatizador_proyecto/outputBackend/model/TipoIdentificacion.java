package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;
import java.math.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad TipoIdentificacion generada automáticamente
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoIdentificacion {




    /**
     * Identificador único del tipo de identificación
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @NotNull

    private Long id;


    /**
     * Nombre del tipo de identificación (Cédula, NIT, Pasaporte, etc.)
     */


    @NotNull

    private String nombre;


    /**
     * Abreviatura del tipo de identificación (CC, NIT, PAS, etc.)
     */


    @NotNull

    private String abreviatura;


    /**
     * Indica si el tipo de identificación está activo
     */


    @NotNull

    private Boolean activo;



}