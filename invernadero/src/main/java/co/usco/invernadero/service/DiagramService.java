package co.usco.invernadero.service;

import co.usco.invernadero.dto.EntityDiagramDTO;
import co.usco.invernadero.dto.FieldDTO;
import co.usco.invernadero.dto.RelationDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para Diagramas
 */
@Service
@RequiredArgsConstructor
public class DiagramService {

    private final EntityManager entityManager;

    public List<EntityDiagramDTO> getDiagramInfo() {
        List<EntityDiagramDTO> diagram = new ArrayList<>();

        // Obtener todas las entidades registradas en JPA
        entityManager.getMetamodel().getEntities().forEach(entityType -> {
            Class<?> clazz = entityType.getJavaType();
            String entityName = clazz.getSimpleName();

            List<FieldDTO> fields = new ArrayList<>();
            List<RelationDTO> relations = new ArrayList<>();

            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true);

                // Comprobar si es clave primaria
                boolean isId = field.isAnnotationPresent(Id.class);

                // Comprobar si es NotNull
                boolean notNull = field.isAnnotationPresent(NotNull.class);

                // Crear FieldDTO
                FieldDTO fieldDTO = new FieldDTO(
                        field.getName(),
                        field.getType().getSimpleName(),
                        isId,
                        notNull
                );
                fields.add(fieldDTO);

                // Comprobar relaciones ManyToOne / OneToMany / OneToOne
                if (field.isAnnotationPresent(ManyToOne.class) ||
                    field.isAnnotationPresent(OneToMany.class) ||
                    field.isAnnotationPresent(OneToOne.class)) {

                    RelationDTO relDTO = new RelationDTO(
                            field.getAnnotation(ManyToOne.class) != null ? "ManyToOne" :
                            field.getAnnotation(OneToMany.class) != null ? "OneToMany" : "OneToOne",
                            field.getType().getSimpleName(),
                            field.getName()
                    );
                    relations.add(relDTO);
                }
            }

            diagram.add(new EntityDiagramDTO(entityName, fields, relations));
        });

        return diagram;
    }
}