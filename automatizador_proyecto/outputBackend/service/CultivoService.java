package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;
import co.usco.invernadero.model.Cultivo;
import co.usco.invernadero.repository.CultivoRepository;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para Cultivo
 */
@Service
public class CultivoService {

    private final CultivoRepository repo;

    public CultivoService(CultivoRepository repo) {
        this.repo = repo;
    }

    public List<Cultivo> findAll() {
        return repo.findAll();
    }

    public Cultivo save(Cultivo entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}