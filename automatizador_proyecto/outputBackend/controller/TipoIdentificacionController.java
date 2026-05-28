package co.usco.invernadero.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import co.usco.invernadero.model.TipoIdentificacion;
import co.usco.invernadero.service.TipoIdentificacionService;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para TipoIdentificacion
 */
@RestController
@RequestMapping("/tipo_identificacion")
public class TipoIdentificacionController {

    private final TipoIdentificacionService service;

    public TipoIdentificacionController(TipoIdentificacionService service) {
        this.service = service;
    }

    @GetMapping
    public List<TipoIdentificacion> getAll() {
        return service.findAll();
    }

    @PostMapping
    public TipoIdentificacion save(@RequestBody TipoIdentificacion entity) {
        return service.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}