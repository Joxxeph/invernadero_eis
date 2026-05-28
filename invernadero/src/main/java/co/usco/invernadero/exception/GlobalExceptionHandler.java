package co.usco.invernadero.exception;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Clase encargada de centralizar el manejo global de excepciones
 * generadas dentro de la API REST, permitiendo capturar errores no controlados
 * y retornar una respuesta HTTP uniforme al cliente consumidor.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Captura cualquier excepción no controlada producida durante la ejecución
     * de los servicios del sistema y construye una respuesta HTTP con código 500
     * indicando un error interno del servidor.
     *
     * @param ex excepción generada en cualquier capa de la aplicación
     * @return respuesta HTTP con el mensaje de error correspondiente
     */

   
    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<String> handleBusinessException(
            BusinessException ex,
            Locale locale) {

        String message = messageSource.getMessage(
                ex.getKey(),
                null,
                locale
        );

        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAll(Exception ex, Locale locale) {

        String message = messageSource.getMessage(
                "internal.error",
                null,
                locale
        );

        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}