package co.usco.invernadero.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import co.usco.invernadero.model.Cultivo;
import co.usco.invernadero.service.CultivoService;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Cultivo
 */
@RestController
@RequestMapping("/cultivo")
public class CultivoController {

    private final CultivoService service;

    public CultivoController(CultivoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Cultivo> getAll() {
        return service.findAll();
    }

    @PostMapping
    public Cultivo save(@RequestBody Cultivo entity) {
        return service.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}