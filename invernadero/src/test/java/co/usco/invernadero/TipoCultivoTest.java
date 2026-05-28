package co.usco.invernadero;

import co.usco.invernadero.controller.ClienteController;
import co.usco.invernadero.controller.TipoCultivoController;
import co.usco.invernadero.model.TipoCultivo;
import co.usco.invernadero.repository.TipoCultivoRepository;
import co.usco.invernadero.service.TipoCultivoService;

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
 * Propósito: Testing de controller, repositorio y service para tipo cultivo
 */
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class TipoCultivoTest {

    /**
    * Repositorio de tipo cultivo
    */
    @Mock
    private TipoCultivoRepository repo;
    /**
    * Service de tipo cultivo
    */
    @InjectMocks
    private TipoCultivoService service;
    /**
    * Controller de tipo cultivo
    */
    private TipoCultivoController controller;
    /**
    * Mock de tipo cultivo
    */
    private MockMvc mockMvc;
    /**
    * Modelo de tipo cultivo
    */
    private TipoCultivo cultivo;

    @BeforeEach
    void setUp() {
        controller = new TipoCultivoController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        cultivo = new TipoCultivo();
        cultivo.setId(1L);
        cultivo.setNombre("Tomate");
        cultivo.setDescripcion("Cultivo de tomate rojo");
        cultivo.setClasificacion("Hortaliza");
        cultivo.setTiempo_cosecha_dias(90);
        cultivo.setTemporada("Todo el año");
        cultivo.setActivo(true);
    }

    // =========================
    // SERVICE TESTS
    // =========================

    @Test
    void testFindAll() {
        when(repo.findAll()).thenReturn(List.of(cultivo));

        List<TipoCultivo> result = service.findAll();

        assertEquals(1, result.size());
        verify(repo).findAll();
    }

    @Test
    void testSave() {
        when(repo.save(any())).thenReturn(cultivo);

        TipoCultivo result = service.save(cultivo);

        assertEquals("Tomate", result.getNombre());
        verify(repo).save(cultivo);
    }

    @Test
    void testUpdateSuccess() {
        when(repo.findById(1L)).thenReturn(Optional.of(cultivo));
        when(repo.save(any())).thenReturn(cultivo);

        TipoCultivo nuevo = new TipoCultivo();
        nuevo.setNombre("Papa");
        nuevo.setDescripcion("Cultivo de papa");
        nuevo.setClasificacion("Tuberculo");
        nuevo.setTiempo_cosecha_dias(120);
        nuevo.setTemporada("Invierno");
        nuevo.setActivo(false);

        TipoCultivo result = service.update(1L, nuevo);

        assertEquals("Papa", result.getNombre());
        assertEquals("Tuberculo", result.getClasificacion());

        verify(repo).findById(1L);
        verify(repo).save(any());
    }

    @Test
    void testUpdateNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            service.update(99L, cultivo);
        });
    }

    @Test
    void testDelete() {
        doNothing().when(repo).deleteById(1L);

        service.delete(1L);

        verify(repo).deleteById(1L);
    }

    // =========================
    // CONTROLLER TESTS
    // =========================

    @Test
    void testControllerGetAll() {
        when(repo.findAll()).thenReturn(List.of(cultivo));

        List<TipoCultivo> result = controller.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void testControllerSave() {
        when(repo.save(any())).thenReturn(cultivo);

        TipoCultivo result = controller.save(cultivo);

        assertEquals("Tomate", result.getNombre());
    }

    @Test
    void testControllerUpdate() {
        when(repo.findById(1L)).thenReturn(Optional.of(cultivo));
        when(repo.save(any())).thenReturn(cultivo);

        TipoCultivo result = controller.update(1L, cultivo);

        assertNotNull(result);
    }

    @Test
    void testControllerDelete() {
        doNothing().when(repo).deleteById(1L);

        controller.delete(1L);

        verify(repo).deleteById(1L);
    }
}