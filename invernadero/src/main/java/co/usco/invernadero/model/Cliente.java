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
 * Propósito: Entidad encargada de representar la información comercial
 * y de comportamiento de compra asociada a un cliente registrado dentro
 * del sistema de gestión del invernadero.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que almacena la información comercial y de compras de los clientes")
public class Cliente {




    /**
     * Identificador único del cliente
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del cliente", example = "1")



    private Long id;


    /**
     * Identificador de la persona (FK)
     */


    @NotNull
    @Schema(description = "Identificador de la persona relacionada", example = "3")

    private Integer id_persona;


    /**
     * Categoría del cliente (regular, premium, etc.)
     */

    @Schema(description = "Categoría comercial del cliente", example = "Premium")

    private String categoria;


    /**
     * Porcentaje de descuento aplicable
     */

    @Schema(description = "Porcentaje de descuento aplicable", example = "10.50")

    private BigDecimal descuento;


    /**
     * Frecuencia de compra del cliente
     */

    @Schema(description = "Frecuencia de compra del cliente", example = "Mensual")

    private String frecuencia_compra;


    /**
     * Fecha de la última compra
     */

    @Schema(description = "Fecha de la última compra realizada", example = "2026-04-15")

    private LocalDate fecha_ultima_compra;



    /**
     * Relación ManyToOne con Persona
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_persona", insertable=false, updatable=false)
    @Schema(description = "Información de la persona asociada al cliente")

    private Persona persona;

}