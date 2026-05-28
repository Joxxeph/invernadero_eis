package co.usco.invernadero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import co.usco.invernadero.model.TipoCultivo;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Repositorio de TipoCultivo para acceso a datos
 */
public interface TipoCultivoRepository extends JpaRepository<TipoCultivo, Long> {
}