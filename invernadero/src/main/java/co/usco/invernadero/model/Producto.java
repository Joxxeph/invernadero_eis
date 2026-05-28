package co.usco.invernadero.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad encargada de representar los productos comercializables
 * obtenidos a partir de los cultivos, incluyendo datos de inventario,
 * precios, vencimiento y disponibilidad.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que almacena la información comercial e inventario de productos")
public class Producto {




    /**
     * Identificador único del producto
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del producto", example = "1")



    private Long id;


    /**
     * Identificador del cultivo (FK)
     */


    @NotNull
    @Schema(description = "Identificador del cultivo asociado", example = "2")

    private Integer id_cultivo;


    /**
     * Nombre del producto
     */


    @NotNull
    @Schema(description = "Nombre del producto", example = "Lechuga Crespa")

    private String nombre;


    /**
     * Descripción detallada del producto
     */

    @Schema(description = "Descripción del producto", example = "Producto fresco cosechado en invernadero")

    private String descripcion;


    /**
     * Precio unitario del producto
     */

    @Schema(description = "Precio unitario", example = "4500.00")

    @NotNull

    private BigDecimal precio;


    /**
     * Unidad de medida (kilogramo, unidad, libra, etc.)
     */


    @NotNull
    @Schema(description = "Unidad de medida", example = "Kilogramo")

    private String unidad_medida;


    /**
     * Cantidad actual en inventario
     */


    @NotNull
    @Schema(description = "Stock actual", example = "150.00")

    private BigDecimal stock_actual;


    /**
     * Stock mínimo para reabastecimiento
     */


    @NotNull
    @Schema(description = "Stock mínimo permitido", example = "20.00")

    private BigDecimal stock_minimo;


    /**
     * Categoría del producto
     */

    @Schema(description = "Categoría del producto", example = "Hortaliza")

    private String categoria;


    /**
     * Fecha de cosecha del producto
     */

    @Schema(description = "Fecha de cosecha", example = "2026-05-01")

    private LocalDate fecha_cosecha;


    /**
     * Fecha de vencimiento del producto
     */

    @Schema(description = "Fecha de vencimiento", example = "2026-05-10")

    private LocalDate fecha_vencimiento;


    /**
     * Indica si el producto está activo
     */


    @NotNull
    @Schema(description = "Indica si el producto está activo", example = "true")

    private Boolean activo;



    /**
     * Relación ManyToOne con Cultivo
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cultivo", insertable=false, updatable=false)
    @Schema(description = "Información del cultivo asociado")
    private Cultivo cultivo;

}