package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;
import java.math.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad Persona generada automáticamente
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Persona {




    /**
     * Identificador único de la persona
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    @NotNull

    private Long id;


    /**
     * Identificador del tipo de identificación (FK)
     */


    @NotNull

    private Integer id_tipo_identificacion;


    /**
     * Número de identificación de la persona
     */


    @NotNull

    private String identificacion;


    /**
     * Nombre(s) de la persona
     */


    @NotNull

    private String nombre;


    /**
     * Apellido(s) de la persona
     */


    @NotNull

    private String apellido;


    /**
     * Correo electrónico de la persona
     */


    private String email;


    /**
     * Teléfono de contacto
     */


    private String telefono;


    /**
     * Dirección física
     */


    private String direccion;


    /**
     * Fecha de registro en el sistema
     */


    @NotNull

    private LocalDateTime fecha_registro;


    /**
     * Indica si la persona está activa en el sistema
     */


    @NotNull

    private Boolean activo;



    /**
     * Relación ManyToOne con TipoIdentificacion
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_identificacion", insertable=false, updatable=false)
    private TipoIdentificacion tipo_identificacion;

}