package co.usco.invernadero.controller;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import co.usco.invernadero.model.Persona;
import co.usco.invernadero.service.PersonaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Persona
 */



/**
 * Controlador REST encargado de gestionar las operaciones CRUD
 * relacionadas con la entidad Persona dentro del sistema Invernadero.
 *
 * <p>
 * Permite consultar, registrar, editar y eliminar Personas,
 * controlando el acceso mediante roles de seguridad ADMIN y USER.
 * </p>
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */
@RestController
@RequestMapping("/api/persona")
@Tag(name = "Persona", description = "Gestión de Personas")
public class PersonaController {

    private final PersonaService service;
    /**
     * Constructor que inyecta el servicio de Persona.
     *
     * @param service servicio encargado de la lógica de negocio de Personas.
     */
    public PersonaController(PersonaService service) {
        this.service = service;
    }
    /**
     * Obtiene la lista completa de Personas registrados en el sistema.
     *
     * @return lista de objetos Persona.
     */
    @Operation(summary = "Listar Personas", description = "Listado de Personas registradas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Consulta realizada correctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public List<Persona> getAll() {
        return service.findAll();
    }
    /**
     * Registra un nuevo Persona dentro del sistema.
     *
     * @param entity objeto Persona con la información a almacenar.
     * @return Persona registrado.
     */
    @Operation(summary = "Registrar una persona", description = "Permite registrar una nuevo Persona")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Persona registrado correctamente"),
            @ApiResponse(responseCode = "403", description = "Sin rol autorizado")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Persona save(@RequestBody Persona entity) {
        return service.save(entity);
    }
    /**
     * Actualiza la información de un Persona existente.
     *
     * @param id identificador único del Persona a editar.
     * @param entity nuevos datos del Persona.
     * @return Persona actualizado.
     */
    @Operation(summary = "Editar Persona", description = "Actualiza los datos de un Persona por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Persona actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Persona no encontrado")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Persona update(@PathVariable Long id, @RequestBody Persona entity) {
        return service.update(id, entity);
    }
    /**
     * Elimina un Persona del sistema según su identificador.
     *
     * @param id identificador del Persona a eliminar.
     */
    @Operation(summary = "Eliminar una persona", description = "Elimina una Persona por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Persona eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Persona no encontrado")
    })    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}