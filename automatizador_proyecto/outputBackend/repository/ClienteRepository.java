package co.usco.invernadero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import co.usco.invernadero.model.Cliente;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Repositorio de Cliente para acceso a datos
 */
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}