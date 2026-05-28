package co.usco.invernadero;

import co.usco.invernadero.controller.TipoIdentificacionController;
import co.usco.invernadero.model.TipoIdentificacion;
import co.usco.invernadero.service.TipoIdentificacionService;
import co.usco.invernadero.repository.TipoIdentificacionRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Testing del servicio, repo y controller de TipoIdentificación
 */
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class TipoIdentificacionTest {

    /**
    * Repositorio de tipo de identificación
    */
    @Mock
    private TipoIdentificacionRepository repo;


    /**
    * Servicio de tipo de identificación
    */
    @InjectMocks
    private TipoIdentificacionService service;


    /**
    * Controller de tipo de identificación
    */
    private TipoIdentificacionController controller;


    /**
    * mock para tipo de identificación
    */
    private MockMvc mockMvc;


    /**
    * Modelo de tipo de identificación
    */
    private TipoIdentificacion tipo;

    @BeforeEach
    void setUp() {
        controller = new TipoIdentificacionController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        tipo = new TipoIdentificacion();
        tipo.setId(1L);
        tipo.setNombre("Cedula");
        tipo.setAbreviatura("CC");
        tipo.setActivo(true);
    }

    // =========================
    // SERVICE TESTS
    // =========================

    @Test
    void testFindAll() {
        when(repo.findAll()).thenReturn(List.of(tipo));

        List<TipoIdentificacion> result = service.findAll();

        assertEquals(1, result.size());
        verify(repo).findAll();
    }

    @Test
    void testSave() {
        when(repo.save(any())).thenReturn(tipo);

        TipoIdentificacion result = service.save(tipo);

        assertEquals("Cedula", result.getNombre());
        verify(repo).save(tipo);
    }

    @Test
    void testUpdateSuccess() {
        when(repo.findById(1L)).thenReturn(Optional.of(tipo));
        when(repo.save(any())).thenReturn(tipo);

        TipoIdentificacion nuevo = new TipoIdentificacion();
        nuevo.setNombre("Pasaporte");
        nuevo.setAbreviatura("PAS");
        nuevo.setActivo(false);

        TipoIdentificacion result = service.update(1L, nuevo);

        assertEquals("Pasaporte", result.getNombre());
        verify(repo).findById(1L);
        verify(repo).save(any());
    }

    @Test
    void testUpdateNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            service.update(99L, tipo);
        });
    }

    @Test
    void testDelete() {
        doNothing().when(repo).deleteById(1L);

        service.delete(1L);

        verify(repo).deleteById(1L);
    }

    // =========================
    // CONTROLLER TESTS (BÁSICO)
    // =========================

    @Test
    void testControllerGetAll() throws Exception {
        when(repo.findAll()).thenReturn(List.of(tipo));

        var response = controller.getAll();

        assertEquals(1, response.size());
    }

    @Test
    void testControllerSave() {
        when(repo.save(any())).thenReturn(tipo);

        TipoIdentificacion result = controller.save(tipo);

        assertEquals("Cedula", result.getNombre());
    }

    @Test
    void testControllerUpdate() {
        when(repo.findById(1L)).thenReturn(Optional.of(tipo));
        when(repo.save(any())).thenReturn(tipo);

        TipoIdentificacion result = controller.update(1L, tipo);

        assertNotNull(result);
    }

    @Test
    void testControllerDelete() {
        doNothing().when(repo).deleteById(1L);

        controller.delete(1L);

        verify(repo).deleteById(1L);
    }
}