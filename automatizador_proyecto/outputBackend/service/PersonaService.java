package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;
import co.usco.invernadero.model.Persona;
import co.usco.invernadero.repository.PersonaRepository;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para Persona
 */
@Service
public class PersonaService {

    private final PersonaRepository repo;

    public PersonaService(PersonaRepository repo) {
        this.repo = repo;
    }

    public List<Persona> findAll() {
        return repo.findAll();
    }

    public Persona save(Persona entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}