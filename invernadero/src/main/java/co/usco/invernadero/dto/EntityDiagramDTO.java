package co.usco.invernadero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: DTO principal encargado de consolidar la información estructural
 * de una entidad para la generación del diagrama de base de datos,
 * incluyendo atributos y relaciones.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO que representa una entidad completa dentro del diagrama de base de datos")
public class EntityDiagramDTO {

    /**
     * Nombre identificador de la entidad.
     */
    @Schema(description = "Nombre de la entidad", example = "Cultivo")
    private String entityName;          // Nombre de la entidad
    /**
     * Lista de atributos pertenecientes a la entidad.
     */
    @Schema(description = "Listado de campos de la entidad")
    private List<FieldDTO> fields;      // Atributos de la entidad

    /**
     * Lista de relaciones que posee la entidad con otras tablas.
     */
    @Schema(description = "Listado de relaciones entre entidades")
    private List<RelationDTO> relations; // Relaciones con otras entidades
}