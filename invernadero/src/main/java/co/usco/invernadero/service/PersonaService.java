package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;

import co.usco.invernadero.exception.BusinessException;
import co.usco.invernadero.model.Persona;
import co.usco.invernadero.repository.PersonaRepository;
import java.util.Optional;

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


    public Persona update(Long id, Persona entity) {
        Optional<Persona> optional = repo.findById(id);

        if (optional.isPresent()) {
            Persona existente = optional.get();

            existente.setId_tipo_identificacion(entity.getId_tipo_identificacion());
            existente.setIdentificacion(entity.getIdentificacion());
            existente.setNombre(entity.getNombre());
            existente.setApellido(entity.getApellido());
            existente.setEmail(entity.getEmail());
            existente.setTelefono(entity.getTelefono());
            existente.setDireccion(entity.getDireccion());
            existente.setFecha_registro(entity.getFecha_registro());
            existente.setActivo(entity.getActivo());

            return repo.save(existente);
        } else {
            throw new BusinessException("persona.not.found");
        }
    }

    public Persona save(Persona entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}