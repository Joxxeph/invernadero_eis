package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;
import co.usco.invernadero.model.TipoCultivo;
import co.usco.invernadero.repository.TipoCultivoRepository;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para TipoCultivo
 */
@Service
public class TipoCultivoService {

    private final TipoCultivoRepository repo;

    public TipoCultivoService(TipoCultivoRepository repo) {
        this.repo = repo;
    }

    public List<TipoCultivo> findAll() {
        return repo.findAll();
    }

    public TipoCultivo save(TipoCultivo entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}