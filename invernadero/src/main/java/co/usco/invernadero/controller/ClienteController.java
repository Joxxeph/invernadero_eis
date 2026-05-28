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

import co.usco.invernadero.model.Cliente;
import co.usco.invernadero.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Cliente
 */
 import io.swagger.v3.oas.annotations.tags.Tag;


/**
 * Controlador REST encargado de gestionar las operaciones CRUD
 * relacionadas con la entidad Cliente dentro del sistema Invernadero.
 *
 * <p>
 * Permite consultar, registrar, editar y eliminar clientes,
 * controlando el acceso mediante roles de seguridad ADMIN y USER.
 * </p>
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */
@RestController
@RequestMapping("/api/cliente")
@Tag(name = "Cliente", description = "Gestión de clientes")
public class ClienteController {

    private final ClienteService service;
    /**
     * Constructor que inyecta el servicio de cliente.
     *
     * @param service servicio encargado de la lógica de negocio de clientes.
     */
    public ClienteController(ClienteService service) {
        this.service = service;
    }
    
    /**
     * Obtiene la lista completa de clientes registrados en el sistema.
     *
     * @return lista de objetos Cliente.
     */
    @Operation(summary = "Listado de clientes", description = "Lista los clientes registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Consulta realizada correcctamente"),
            @ApiResponse(responseCode = "403", description = "Sin rol autorizado")
    })
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public List<Cliente> getAll() {
        return service.findAll();
    }
    /**
     * Registra un nuevo cliente dentro del sistema.
  piResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente registrado correctamente"),
            @ApiResponse(responseCode = "403", description = "Solo administradores pueden registrar")
    })   *
     * @param entity objeto Cliente con la información a almacenar.
     * @return cliente registrado.
     */
    @Operation(summary = "Registrar un cliente", description = "Permite registrar un cliente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente registrado correctamente"),
            @ApiResponse(responseCode = "403", description = "Sin rol autorizado")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Cliente save(@RequestBody Cliente entity) {
        return service.save(entity);
    }
    /**
     * Actualiza la información de un cliente existente.
     *
     * @param id identificador único del cliente a editar.
     * @param entity nuevos datos del cliente.
     * @return cliente actualizado.
     */
    @Operation(summary = "Editar cliente", description = "Edita los datos de un cliente por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente actualizado correcctamente"),
            @ApiResponse(responseCode = "404", description = "Cliente no ha sido encontrado")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Cliente update(@PathVariable Long id, @RequestBody Cliente entity) {
        return service.update(id, entity);
    }
    /**
     * Elimina un cliente del sistema según su identificador.
     *
     * @param id identificador del cliente a eliminar.
     */
    @Operation(summary = "Eliminar a un cliente", description = "Elimina cliente por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Cliente no encontrado")
    })    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}