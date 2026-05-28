package co.usco.invernadero.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import co.usco.invernadero.model.TipoCultivo;
import co.usco.invernadero.service.TipoCultivoService;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para TipoCultivo
 */
@RestController
@RequestMapping("/tipo_cultivo")
public class TipoCultivoController {

    private final TipoCultivoService service;

    public TipoCultivoController(TipoCultivoService service) {
        this.service = service;
    }

    @GetMapping
    public List<TipoCultivo> getAll() {
        return service.findAll();
    }

    @PostMapping
    public TipoCultivo save(@RequestBody TipoCultivo entity) {
        return service.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}