package co.usco.invernadero.service;

import org.springframework.stereotype.Service;
import java.util.List;
import co.usco.invernadero.model.Cliente;
import co.usco.invernadero.repository.ClienteRepository;

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

    public Cliente save(Cliente entity) {
        return repo.save(entity);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}