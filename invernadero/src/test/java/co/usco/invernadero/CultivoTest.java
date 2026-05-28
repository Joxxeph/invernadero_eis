package co.usco.invernadero;

import co.usco.invernadero.controller.CultivoController;
import co.usco.invernadero.model.Cultivo;
import co.usco.invernadero.repository.CultivoRepository;
import co.usco.invernadero.service.CultivoService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
/**
 * Autor: Joseph Gutierrez Martinez
 * Fecha: 2026-04-07
 * Propósito: Testing de controller, repositorio y service para cultivo
 */
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class CultivoTest {
    /**
    * Repositorio de cultivo
    */
    @Mock
    private CultivoRepository repo;
    /**
    * Service de cultivo
    */
    @InjectMocks
    private CultivoService service;
    /**
    * Controller de cultivo
    */
    private CultivoController controller;
    /**
    * Mock de cultivo
    */
    private MockMvc mockMvc;
    /**
    * Modelo de cultivo
    */
    private Cultivo cultivo;

    @BeforeEach
    void setUp() {
        controller = new CultivoController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        cultivo = new Cultivo();
        cultivo.setId(1L);
        cultivo.setId_tipo_cultivo(1);
        cultivo.setNombre("Tomate Cherry");
        cultivo.setDescripcion("Cultivo de tomate pequeño");
        cultivo.setFecha_siembra(LocalDate.of(2026, 1, 10));
        cultivo.setFecha_estimada_cosecha(LocalDate.of(2026, 4, 10));
        cultivo.setFecha_cosecha(null);
        cultivo.setArea_sembrada(new BigDecimal("100.5"));
        cultivo.setCantidad_sembrada(500);
        cultivo.setRendimiento_estimado(new BigDecimal("120.75"));
        cultivo.setEstado("ACTIVO");
        cultivo.setActivo(true);
    }

    // =========================
    // SERVICE TESTS
    // =========================

    @Test
    void testFindAll() {
        when(repo.findAll()).thenReturn(List.of(cultivo));

        List<Cultivo> result = service.findAll();

        assertEquals(1, result.size());
        verify(repo).findAll();
    }

    @Test
    void testSave() {
        when(repo.save(any())).thenReturn(cultivo);

        Cultivo result = service.save(cultivo);

        assertEquals("Tomate Cherry", result.getNombre());
        verify(repo).save(cultivo);
    }

    @Test
    void testUpdateSuccess() {
        when(repo.findById(1L)).thenReturn(Optional.of(cultivo));
        when(repo.save(any())).thenReturn(cultivo);

        Cultivo nuevo = new Cultivo();
        nuevo.setId_tipo_cultivo(2);
        nuevo.setNombre("Papa");
        nuevo.setDescripcion("Cultivo de papa");
        nuevo.setFecha_siembra(LocalDate.of(2026, 2, 1));
        nuevo.setFecha_estimada_cosecha(LocalDate.of(2026, 6, 1));
        nuevo.setFecha_cosecha(LocalDate.of(2026, 6, 5));
        nuevo.setArea_sembrada(new BigDecimal("200"));
        nuevo.setCantidad_sembrada(1000);
        nuevo.setRendimiento_estimado(new BigDecimal("300"));
        nuevo.setEstado("COSECHADO");
        nuevo.setActivo(false);

        Cultivo result = service.update(1L, nuevo);

        assertEquals("Papa", result.getNombre());
        assertEquals("COSECHADO", result.getEstado());

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

        List<Cultivo> result = controller.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void testControllerSave() {
        when(repo.save(any())).thenReturn(cultivo);

        Cultivo result = controller.save(cultivo);

        assertEquals("Tomate Cherry", result.getNombre());
    }

    @Test
    void testControllerUpdate() {
        when(repo.findById(1L)).thenReturn(Optional.of(cultivo));
        when(repo.save(any())).thenReturn(cultivo);

        Cultivo result = controller.update(1L, cultivo);

        assertNotNull(result);
    }

    @Test
    void testControllerDelete() {
        doNothing().when(repo).deleteById(1L);

        controller.delete(1L);

        verify(repo).deleteById(1L);
    }
}