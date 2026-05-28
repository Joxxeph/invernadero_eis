package co.usco.invernadero.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import co.usco.invernadero.model.Cliente;
import co.usco.invernadero.service.ClienteService;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Controlador REST para Cliente
 */
@RestController
@RequestMapping("/cliente")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Cliente> getAll() {
        return service.findAll();
    }

    @PostMapping
    public Cliente save(@RequestBody Cliente entity) {
        return service.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}