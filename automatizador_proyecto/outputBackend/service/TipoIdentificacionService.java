package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;
import co.usco.invernadero.model.TipoIdentificacion;
import co.usco.invernadero.repository.TipoIdentificacionRepository;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para TipoIdentificacion
 */
@Service
public class TipoIdentificacionService {

    private final TipoIdentificacionRepository repo;

    public TipoIdentificacionService(TipoIdentificacionRepository repo) {
        this.repo = repo;
    }

    public List<TipoIdentificacion> findAll() {
        return repo.findAll();
    }

    public TipoIdentificacion save(TipoIdentificacion entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}