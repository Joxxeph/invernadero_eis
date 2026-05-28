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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import co.usco.invernadero.model.Producto;
import co.usco.invernadero.service.ProductoService;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Producto
 */

/**
 * Controlador REST encargado de gestionar las operaciones CRUD
 * relacionadas con la entidad Producto dentro del sistema Invernadero.
 *
 * <p>
 * Permite consultar, registrar, editar y eliminar Productos,
 * controlando el acceso mediante roles de seguridad ADMIN y USER.
 * </p>
 *
 * @author Joseph Gutierrez Martinez
 * @version 1.0
 * @since 2026-04-07
 */
@RestController
@RequestMapping("/api/producto")
@Tag(name = "Producto", description = "Gestión de Productos")
public class ProductoController {

    private final ProductoService service;
    /**
     * Constructor que inyecta el servicio de Producto.
     *
     * @param service servicio encargado de la lógica de negocio de Productos.
     */
    public ProductoController(ProductoService service) {
        this.service = service;
    }
    /**
     * Obtiene la lista completa de Productos registrados en el sistema.
     *
     * @return lista de objetos Producto.
     */
    @Operation(summary = "Listar Productos", description = "Lista a los Productos registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Consulta realizada correctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public List<Producto> getAll() {
        return service.findAll();
    }
    /**
     * Registra un nuevo Producto dentro del sistema.
     *
     * @param entity objeto Producto con la información a almacenar.
     * @return Producto registrado.
     */
    @Operation(summary = "Registrar uun Producto", description = "Registra un nuevo Producto")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto registrado correctamente"),
            @ApiResponse(responseCode = "403", description = "Solo administradores pueden registrar")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Producto save(@RequestBody Producto entity) {
        return service.save(entity);
    }
    /**
     * Actualiza la información de un Producto existente.
     *
     * @param id identificador único del Producto a editar.
     * @param entity nuevos datos del Producto.
     * @return Producto actualizado.
     */
    @Operation(summary = "Editar Producto", description = "Edita los datos de un Producto por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Producto update(@PathVariable Long id, @RequestBody Producto entity) {
        return service.update(id, entity);
    }
    /**
     * Elimina un Producto del sistema según su identificador.
     *
     * @param id identificador del Producto a eliminar.
     */
    @Operation(summary = "Eliminar Producto", description = "Elimina un Producto por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })   
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}