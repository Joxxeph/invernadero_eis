package co.usco.invernadero.service;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import co.usco.invernadero.exception.BusinessException;
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


    public TipoCultivo update(Long id, TipoCultivo entity) {
        Optional<TipoCultivo> optional = repo.findById(id);

        if (optional.isPresent()) {
            TipoCultivo existente = optional.get();

            existente.setNombre(entity.getNombre());
            existente.setDescripcion(entity.getDescripcion());
            existente.setClasificacion(entity.getClasificacion());
            existente.setTiempo_cosecha_dias(entity.getTiempo_cosecha_dias());
            existente.setTemporada(entity.getTemporada());
            existente.setActivo(entity.getActivo());

            return repo.save(existente);
        } else {
            throw new BusinessException("tipocultivo.not.found");
        }
    }



    public TipoCultivo save(TipoCultivo entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}