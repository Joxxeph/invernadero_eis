package co.usco.invernadero;

import co.usco.invernadero.controller.PersonaController;
import co.usco.invernadero.model.Persona;
import co.usco.invernadero.service.PersonaService;
import co.usco.invernadero.repository.PersonaRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Testing del servicio, repo y controller de Persona
 */
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class PersonaTest {

    /**
    * Repositorio de persona
    */
    @Mock
    private PersonaRepository repo;
    /**
    * Servicio de persona
    */
    @InjectMocks
    private PersonaService service;
    /**
    * controlador de persona
    */
    private PersonaController controller;
    /**
    * mock para persona
    */
    private MockMvc mockMvc;
    /**
    * Modelo de persona
    */
    private Persona persona;

    @BeforeEach
    void setUp() {
        controller = new PersonaController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        persona = new Persona();
        persona.setId(1L);
        persona.setId_tipo_identificacion(1);
        persona.setIdentificacion("123456789");
        persona.setNombre("Maria");
        persona.setApellido("Barros");
        persona.setEmail("maria@test.com");
        persona.setTelefono("3001234567");
        persona.setDireccion("Neiva");
        persona.setFecha_registro(LocalDateTime.now());
        persona.setActivo(true);
    }

    // =========================
    // SERVICE TESTS
    // =========================

    @Test
    void testFindAll() {
        when(repo.findAll()).thenReturn(List.of(persona));

        List<Persona> result = service.findAll();

        assertEquals(1, result.size());
        verify(repo).findAll();
    }

    @Test
    void testSave() {
        when(repo.save(any())).thenReturn(persona);

        Persona result = service.save(persona);

        assertEquals("Maria", result.getNombre());
        verify(repo).save(persona);
    }

    @Test
    void testUpdateSuccess() {
        when(repo.findById(1L)).thenReturn(Optional.of(persona));
        when(repo.save(any())).thenReturn(persona);

        Persona nueva = new Persona();
        nueva.setId_tipo_identificacion(2);
        nueva.setIdentificacion("987654321");
        nueva.setNombre("Juan");
        nueva.setApellido("Perez");
        nueva.setEmail("juan@test.com");
        nueva.setTelefono("3100000000");
        nueva.setDireccion("Bogota");
        nueva.setFecha_registro(LocalDateTime.now());
        nueva.setActivo(false);

        Persona result = service.update(1L, nueva);

        assertEquals("Juan", result.getNombre());
        assertEquals("Perez", result.getApellido());

        verify(repo).findById(1L);
        verify(repo).save(any());
    }

    @Test
    void testUpdateNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            service.update(99L, persona);
        });
    }

    @Test
    void testDelete() {
        doNothing().when(repo).deleteById(1L);

        service.delete(1L);

        verify(repo).deleteById(1L);
    }

    // =========================
    // CONTROLLER TESTS (BÁSICOS)
    // =========================

    @Test
    void testControllerGetAll() {
        when(repo.findAll()).thenReturn(List.of(persona));

        List<Persona> result = controller.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void testControllerSave() {
        when(repo.save(any())).thenReturn(persona);

        Persona result = controller.save(persona);

        assertEquals("Maria", result.getNombre());
    }

    @Test
    void testControllerUpdate() {
        when(repo.findById(1L)).thenReturn(Optional.of(persona));
        when(repo.save(any())).thenReturn(persona);

        Persona result = controller.update(1L, persona);

        assertNotNull(result);
    }

    @Test
    void testControllerDelete() {
        doNothing().when(repo).deleteById(1L);

        controller.delete(1L);

        verify(repo).deleteById(1L);
    }
}