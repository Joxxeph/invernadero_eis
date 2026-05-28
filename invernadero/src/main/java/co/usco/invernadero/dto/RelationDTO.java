package co.usco.invernadero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: DTO encargado de representar una relación existente entre
 * dos entidades dentro del modelo relacional del sistema.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO que representa una relación entre entidades del diagrama")
public class RelationDTO {

    /**
     * Tipo de cardinalidad de la relación.
     */
    @Schema(description = "Tipo de relación entre entidades", example = "OneToMany")
    private String type;      // Tipo de relación: ManyToOne, OneToMany...
    /**
     * Nombre de la entidad con la que se establece la relación.
     */
    @Schema(description = "Entidad destino relacionada", example = "Usuario")
    private String targetEntity; // Entidad destino
    /**
     * Nombre de la entidad con la que se establece la relación.
     */
    @Schema(description = "Entidad destino relacionada", example = "Usuario")
    private String mappedBy;  // Nombre del campo local
}