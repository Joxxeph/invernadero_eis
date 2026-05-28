package co.usco.invernadero.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.context.MessageSource;
import java.util.Locale;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Lógica de negocio para envio de emails
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final MessageSource messageSource;

    public EmailService(JavaMailSender mailSender, MessageSource messageSource) {
        this.mailSender = mailSender;
        this.messageSource = messageSource;

    }

    public void enviarCodigo(String to, String codigo, Locale locale) {

        String subject = messageSource.getMessage(
                "email.2fa.subject",
                null,
                locale
        );

        String text = messageSource.getMessage(
                "email.2fa.body",
                new Object[]{codigo},
                locale
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}