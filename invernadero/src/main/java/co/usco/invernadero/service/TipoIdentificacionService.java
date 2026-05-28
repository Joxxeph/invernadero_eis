package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import co.usco.invernadero.exception.BusinessException;
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


    public TipoIdentificacion update(Long id, TipoIdentificacion entity) {
        Optional<TipoIdentificacion> optional = repo.findById(id);

        if (optional.isPresent()) {
            TipoIdentificacion existente = optional.get();

            existente.setNombre(entity.getNombre());
            existente.setAbreviatura(entity.getAbreviatura());
            existente.setActivo(entity.getActivo());

            return repo.save(existente);
        } else {
            throw new BusinessException("tipoIdent.not.found");
        }
    }

    public TipoIdentificacion save(TipoIdentificacion entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}