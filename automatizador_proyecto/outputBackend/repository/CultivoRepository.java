package co.usco.invernadero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import co.usco.invernadero.model.Cultivo;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Repositorio de Cultivo para acceso a datos
 */
public interface CultivoRepository extends JpaRepository<Cultivo, Long> {
}