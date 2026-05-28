package co.usco.invernadero.security;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Servicio encargado de la generación y validación de códigos OTP
 * utilizados en el proceso de doble autenticación.
 */
@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();

    /**
     * Genera un código OTP de 6 dígitos asociado a un usuario.
     */
    public String generarOtp(String username) {
        String code = String.valueOf(100000 + new Random().nextInt(900000));
        otpStorage.put(username, code);
        return code;
    }

    public boolean validarOtp(String username, String code) {
        return code.equals(otpStorage.get(username));
    }

    public void limpiarOtp(String username) {
        otpStorage.remove(username);
    }
}