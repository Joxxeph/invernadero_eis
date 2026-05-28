package co.usco.invernadero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: DTO encargado de representar la estructura de un atributo perteneciente
 * a una entidad dentro del generador de diagramas de base de datos.
 * Contiene información sobre nombre, tipo, restricción de llave primaria
 * y nulabilidad del campo. */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO que representa un campo o atributo de una entidad en el diagrama de base de datos")
public class FieldDTO {
    /**
     * Nombre asignado al atributo dentro de la entidad.
     */
    @Schema(description = "Nombre del campo dentro de la entidad", example = "idCultivo")
    private String name;     // Nombre del campo

    /**
     * Tipo de dato definido para el atributo.
     */
    @Schema(description = "Tipo de dato del campo", example = "Long")
    private String type;     // Tipo de dato

    /**
     * Indica si el atributo corresponde a la llave primaria de la entidad.
     */
    @Schema(description = "Determina si el campo es llave primaria", example = "true")
    private boolean primaryKey;

    /**
     * Indica si el atributo permite almacenar valores nulos.
     */
    @Schema(description = "Determina si el campo acepta valores nulos", example = "false")
    private boolean nullable;
}

