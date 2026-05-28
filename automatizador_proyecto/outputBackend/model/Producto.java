package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;
import java.math.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad Producto generada automáticamente
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {




    /**
     * Identificador único del producto
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @NotNull

    private Long id;


    /**
     * Identificador del cultivo (FK)
     */


    @NotNull

    private Integer id_cultivo;


    /**
     * Nombre del producto
     */


    @NotNull

    private String nombre;


    /**
     * Descripción detallada del producto
     */


    private String descripcion;


    /**
     * Precio unitario del producto
     */


    @NotNull

    private BigDecimal precio;


    /**
     * Unidad de medida (kilogramo, unidad, libra, etc.)
     */


    @NotNull

    private String unidad_medida;


    /**
     * Cantidad actual en inventario
     */


    @NotNull

    private BigDecimal stock_actual;


    /**
     * Stock mínimo para reabastecimiento
     */


    @NotNull

    private BigDecimal stock_minimo;


    /**
     * Categoría del producto
     */


    private String categoria;


    /**
     * Fecha de cosecha del producto
     */


    private LocalDate fecha_cosecha;


    /**
     * Fecha de vencimiento del producto
     */


    private LocalDate fecha_vencimiento;


    /**
     * Indica si el producto está activo
     */


    @NotNull

    private Boolean activo;



    /**
     * Relación ManyToOne con Cultivo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cultivo", insertable=false, updatable=false)
    private Cultivo cultivo;

}