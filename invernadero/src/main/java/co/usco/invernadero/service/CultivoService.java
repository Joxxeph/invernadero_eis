package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import co.usco.invernadero.exception.BusinessException;
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


    public Cultivo update(Long id, Cultivo entity) {
        Optional<Cultivo> optional = repo.findById(id);

        if (optional.isPresent()) {
            Cultivo existente = optional.get();

            existente.setId_tipo_cultivo(entity.getId_tipo_cultivo());
            existente.setNombre(entity.getNombre());
            existente.setDescripcion(entity.getDescripcion());
            existente.setFecha_siembra(entity.getFecha_siembra());
            existente.setFecha_estimada_cosecha(entity.getFecha_estimada_cosecha());
            existente.setFecha_cosecha(entity.getFecha_cosecha());
            existente.setArea_sembrada(entity.getArea_sembrada());
            existente.setCantidad_sembrada(entity.getCantidad_sembrada());
            existente.setRendimiento_estimado(entity.getRendimiento_estimado());
            existente.setEstado(entity.getEstado());
            existente.setActivo(entity.getActivo());

            return repo.save(existente);
        } else {
            throw new BusinessException("cultivo.not.found");
        }
    }


    public Cultivo save(Cultivo entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}