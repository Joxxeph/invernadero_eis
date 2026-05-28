package co.usco.invernadero.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import co.usco.invernadero.model.Persona;
import co.usco.invernadero.service.PersonaService;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Persona
 */
@RestController
@RequestMapping("/persona")
public class PersonaController {

    private final PersonaService service;

    public PersonaController(PersonaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Persona> getAll() {
        return service.findAll();
    }

    @PostMapping
    public Persona save(@RequestBody Persona entity) {
        return service.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}