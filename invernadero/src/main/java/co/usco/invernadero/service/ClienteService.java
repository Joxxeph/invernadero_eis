package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;

import co.usco.invernadero.exception.BusinessException;
import co.usco.invernadero.model.Cliente;
import co.usco.invernadero.repository.ClienteRepository;
import java.util.Optional;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para Cliente
 */
@Service
public class ClienteService {

    private final ClienteRepository repo;

    public ClienteService(ClienteRepository repo) {
        this.repo = repo;
    }

    public List<Cliente> findAll() {
        return repo.findAll();
    }

    public Cliente update(Long id, Cliente entity) {
        Optional<Cliente> optional = repo.findById(id);

        if (optional.isPresent()) {
            Cliente existente = optional.get();

            existente.setId_persona(entity.getId_persona());
            existente.setCategoria(entity.getCategoria());
            existente.setDescuento(entity.getDescuento());
            existente.setFrecuencia_compra(entity.getFrecuencia_compra());
            existente.setFecha_ultima_compra(entity.getFecha_ultima_compra());

            return repo.save(existente);
        } else {
            throw new BusinessException("cliente.not.found");
        }
    }

    public Cliente save(Cliente entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}