package co.usco.invernadero.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.usco.invernadero.model.Cultivo;
import co.usco.invernadero.service.CultivoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Cultivo
 */

/**
 * Controlador REST encargado de gestionar las operaciones CRUD
 * relacionadas con la entidad cultivo dentro del sistema Invernadero.
 *
 * <p>
 * Permite consultar, registrar, editar y eliminar cultivos,
 * controlando el acceso mediante roles de seguridad ADMIN y USER.
 * </p>
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */
@RestController
@RequestMapping("/api/cultivo")
@Tag(name="Cultivo", description= "Gestion de cultivos")
public class CultivoController {

    private final CultivoService service;
    /**
     * Constructor que inyecta el servicio de cultivo.
     *
     * @param service servicio encargado de la lógica de negocio de cultivos.
     */
    public CultivoController(CultivoService service) {
        this.service = service;
    }
    /**
     * Obtiene la lista completa de cultivos registrados en el sistema.
     *
     * @return lista de objetos cultivo.
     */
    @Operation(summary = "Listar cultivos", description = "Lista los cultivos registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Consulta realizada correctamente"),
            @ApiResponse(responseCode = "403", description = "Sin rol autorizado")
    })
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public List<Cultivo> getAll() {
        return service.findAll();
    }
    /**
     * Registra un nuevo cultivo dentro del sistema.
     *
     * @param entity objeto cultivo con la información a almacenar.
     * @return cultivo registrado.
     */
    @Operation(summary = "Crear un cultivo", description = "Registra un nuevo cultivo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "cultivo registrado correctamente"),
            @ApiResponse(responseCode = "403", description = "Sin rol autorizado")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Cultivo save(@RequestBody Cultivo entity) {
        return service.save(entity);
    }
    /**
     * Actualiza la información de un cultivo existente.
     *
     * @param id identificador único del cultivo a editar.
     * @param entity nuevos datos del cultivo.
     * @return cultivo actualizado.
     */
    @Operation(summary = "Editar un cultivo", description = "Actualiza los datos de un cultivo por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "cultivo actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "cultivo no encontrado")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Cultivo update(@PathVariable Long id, @RequestBody Cultivo entity) {
        return service.update(id, entity);
    }
    /**
     * Elimina un cultivo del sistema según su identificador.
     *
     * @param id identificador del cultivo a eliminar.
     */
    @Operation(summary = "Eliminar un cultivo", description = "Elimina un cultivo por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cultivo eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Cultivo no fue encontrado")
    })  
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}