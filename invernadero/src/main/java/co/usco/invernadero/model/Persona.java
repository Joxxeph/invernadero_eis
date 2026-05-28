package co.usco.invernadero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.*;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Entidad encargada de almacenar la información personal
 * y de contacto de las personas vinculadas al sistema,
 * tales como clientes, proveedores o administradores.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que almacena la información básica y de contacto de una persona")

public class Persona {




    /**
     * Identificador único de la persona
     */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único de la persona", example = "1")



    private Long id;


    /**
     * Identificador del tipo de identificación (FK)
     */


    @NotNull
    @Schema(description = "Identificador del tipo de identificación", example = "1")

    private Integer id_tipo_identificacion;


    /**
     * Número de identificación de la persona
     */


    @NotNull
    @Schema(description = "Número de identificación", example = "1075245896")

    private String identificacion;


    /**
     * Nombre(s) de la persona
     */


    @NotNull
    @Schema(description = "Nombre de la persona", example = "Maria Alejandra")

    private String nombre;


    /**
     * Apellido(s) de la persona
     */


    @NotNull
    @Schema(description = "Apellido de la persona", example = "Barros Murillo")

    private String apellido;


    /**
     * Correo electrónico de la persona
     */
    @Schema(description = "Correo electrónico", example = "maria@correo.com")


    private String email;


    /**
     * Teléfono de contacto
     */
    @Schema(description = "Teléfono de contacto", example = "3104567890")
 
    private String telefono;


    /**
     * Dirección física
     */

    @Schema(description = "Dirección física", example = "Calle 10 # 15-20")

    private String direccion;


    /**
     * Fecha de registro en el sistema
     */


    @NotNull
    @Schema(description = "Fecha de registro", example = "2026-04-01T10:30:00")

    private LocalDateTime fecha_registro;


    /**
     * Indica si la persona está activa en el sistema
     */


    @NotNull
    @Schema(description = "Estado de activación de la persona", example = "true")

    private Boolean activo;



    /**
     * Relación ManyToOne con TipoIdentificacion
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_identificacion", insertable=false, updatable=false)
    @Schema(description = "Información del tipo de identificación asociado")

    private TipoIdentificacion tipo_identificacion;

}