package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;

import co.usco.invernadero.exception.BusinessException;
import co.usco.invernadero.model.Producto;
import co.usco.invernadero.repository.ProductoRepository;
import java.util.Optional;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para Producto
 */
@Service
public class ProductoService {

    private final ProductoRepository repo;

    public ProductoService(ProductoRepository repo) {
        this.repo = repo;
    }

    public List<Producto> findAll() {
        return repo.findAll();
    }

    public Producto update(Long id, Producto entity) {
        Optional<Producto> optional = repo.findById(id);

        if (optional.isPresent()) {
            Producto existente = optional.get();

            existente.setId_cultivo(entity.getId_cultivo());
            existente.setNombre(entity.getNombre());
            existente.setDescripcion(entity.getDescripcion());
            existente.setPrecio(entity.getPrecio());
            existente.setUnidad_medida(entity.getUnidad_medida());
            existente.setStock_actual(entity.getStock_actual());
            existente.setStock_minimo(entity.getStock_minimo());
            existente.setCategoria(entity.getCategoria());
            existente.setFecha_cosecha(entity.getFecha_cosecha());
            existente.setFecha_vencimiento(entity.getFecha_vencimiento());
            existente.setActivo(entity.getActivo());

            return repo.save(existente);
        } else {
            throw new BusinessException("producto.not.found");
        }
    }


    public Producto save(Producto entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}