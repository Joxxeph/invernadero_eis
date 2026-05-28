package co.usco.invernadero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import co.usco.invernadero.model.Producto;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Repositorio de Producto para acceso a datos
 */
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}