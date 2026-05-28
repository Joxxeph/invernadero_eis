package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;
import co.usco.invernadero.model.Producto;
import co.usco.invernadero.repository.ProductoRepository;

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

    public Producto save(Producto entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}