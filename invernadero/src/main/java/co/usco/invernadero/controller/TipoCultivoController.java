package co.usco.invernadero.controller;

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

import io.swagger.v3.oas.annotations.tags.Tag;

import co.usco.invernadero.model.TipoCultivo;
import co.usco.invernadero.service.TipoCultivoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para TipoCultivo
 */
/**
 * Controlador REST encargado de gestionar las operaciones CRUD
 * relacionadas con la entidad Tipo Cultivo dentro del sistema Invernadero.
 *
 * <p>
 * Permite consultar, registrar, editar y eliminar Tipos Cultivo,
 * controlando el acceso mediante roles de seguridad ADMIN y USER.
 * </p>
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */
@RestController
@RequestMapping("/api/tipo_cultivo")
@Tag(name = "Tipo Cultivo", description = "Gestión de Tipos Cultivo")
public class TipoCultivoController {

    private final TipoCultivoService service;
    /**
     * Constructor que inyecta el servicio de Tipo Cultivo.
     *
     * @param service servicio encargado de la lógica de negocio de Tipos Cultivo.
     */
    public TipoCultivoController(TipoCultivoService service) {
        this.service = service;
    }
    /**
     * Obtiene la lista completa de Tipos Cultivo registrados en el sistema.
     *
     * @return lista de objetos Tipo Cultivo.
     */
    @Operation(summary = "Listar Tipos Cultivo", description = "Lista todos Tipos Cultivo registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Consulta realizada correctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public List<TipoCultivo> getAll() {
        return service.findAll();
    }
    /**
     * Registra un nuevo Tipo Cultivo dentro del sistema.
     *
     * @param entity objeto Tipo Cultivo con la información a almacenar.
     * @return Tipo Cultivo registrado.
     */
    @Operation(summary = "Registrar Tipo Cultivo", description = "PRegistra un nuevo Tipo Cultivo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tipo Cultivo registrado correctamente"),
            @ApiResponse(responseCode = "403", description = "Solo administradores pueden registrar")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public TipoCultivo update(@PathVariable Long id, @RequestBody TipoCultivo entity) {
        return service.update(id, entity);
    }
    /**
     * Actualiza la información de un Tipo Cultivo existente.
     *
     * @param id identificador único del Tipo Cultivo a editar.
     * @param entity nuevos datos del Tipo Cultivo.
     * @return Tipo Cultivo actualizado.
     */
    @Operation(summary = "editar Tipo Cultivo", description = "Edita los datos de un Tipo Cultivo por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tipo Cultivo actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Tipo Cultivo no encontrado")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public TipoCultivo save(@RequestBody TipoCultivo entity) {
        return service.save(entity);
    }
    /**
     * Elimina un Tipo Cultivo del sistema según su identificador.
     *
     * @param id identificador del Tipo Cultivo a eliminar.
     */
    @Operation(summary = "Eliminar Tipo Cultivo", description = "Elimina un Tipo Cultivo por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tipo Cultivo eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Tipo Cultivo no encontrado")
    })   
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}