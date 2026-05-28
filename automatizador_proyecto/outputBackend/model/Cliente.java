package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;
import java.math.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad Cliente generada automáticamente
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {




    /**
     * Identificador único del cliente
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @NotNull

    private Long id;


    /**
     * Identificador de la persona (FK)
     */


    @NotNull

    private Integer id_persona;


    /**
     * Categoría del cliente (regular, premium, etc.)
     */


    private String categoria;


    /**
     * Porcentaje de descuento aplicable
     */


    private BigDecimal descuento;


    /**
     * Frecuencia de compra del cliente
     */


    private String frecuencia_compra;


    /**
     * Fecha de la última compra
     */


    private LocalDate fecha_ultima_compra;



    /**
     * Relación ManyToOne con Persona
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona", insertable=false, updatable=false)
    private Persona persona;

}