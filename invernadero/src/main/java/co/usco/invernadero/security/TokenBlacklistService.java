package co.usco.invernadero.security;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Logica de negocio para inhabilitar tokens
 */
@Service
public class TokenBlacklistService {

    private final Set<String> blacklist = new HashSet<>();

    public void blacklistToken(String token) {
        blacklist.add(token);
    }

    public boolean isBlacklisted(String token) {
        return blacklist.contains(token);
    }
}