package co.usco.invernadero.controller;

import co.usco.invernadero.dto.EntityDiagramDTO;
import co.usco.invernadero.service.DiagramService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Diagrama
 */
/**
 * Controlador REST encargado de suministrar la información estructural
 * utilizada para la representación del diagrama entidad-relación
 * del sistema Invernadero.
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */
@RestController
@RequiredArgsConstructor
@Tag(name = "Base de datos", description = "Esquma de base de datos")

public class DiagramController {

    private final DiagramService diagramService;

    /**
     * Obtiene la información del diagrama de entidades del sistema.
     *
     * @return lista de entidades con sus atributos y relaciones.
     */
    @Operation(summary = "Consultar diagrama", description = "Modelo de base de datos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Diagrama obtenido correcctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/api/diagram")
    public List<EntityDiagramDTO> getDiagram() {
        return diagramService.getDiagramInfo();
    }
}