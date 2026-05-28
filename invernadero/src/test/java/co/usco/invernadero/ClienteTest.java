package co.usco.invernadero;

import co.usco.invernadero.controller.ClienteController;
import co.usco.invernadero.model.Cliente;
import co.usco.invernadero.service.ClienteService;
import co.usco.invernadero.repository.ClienteRepository;

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
 * Propósito: Testing de controller, repositorio y service para cliente
 */
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class ClienteTest {

    /**
    * Repositorio de cliente
    */
    @Mock
    private ClienteRepository repo;

    /**
    * Service de cliente
    */
    @InjectMocks
    private ClienteService service;

    /**
    * controller de cliente
    */
    private ClienteController controller;

    /**
    * Mock para cliente
    */
    private MockMvc mockMvc;
    
    /**
    * Modelo de cliente
    */
    private Cliente cliente;

    @BeforeEach
    void setUp() {
        controller = new ClienteController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setId_persona(1);
        cliente.setCategoria("Premium");
        cliente.setDescuento(new BigDecimal("10.5"));
        cliente.setFrecuencia_compra("Alta");
        cliente.setFecha_ultima_compra(LocalDate.now());
    }

    // =========================
    // SERVICE TESTS
    // =========================

    @Test
    void testFindAll() {
        when(repo.findAll()).thenReturn(List.of(cliente));

        List<Cliente> result = service.findAll();

        assertEquals(1, result.size());
        verify(repo).findAll();
    }

    @Test
    void testSave() {
        when(repo.save(any())).thenReturn(cliente);

        Cliente result = service.save(cliente);

        assertEquals("Premium", result.getCategoria());
        verify(repo).save(cliente);
    }

    @Test
    void testUpdateSuccess() {
        when(repo.findById(1L)).thenReturn(Optional.of(cliente));
        when(repo.save(any())).thenReturn(cliente);

        Cliente nuevo = new Cliente();
        nuevo.setId_persona(2);
        nuevo.setCategoria("Regular");
        nuevo.setDescuento(new BigDecimal("5.0"));
        nuevo.setFrecuencia_compra("Baja");
        nuevo.setFecha_ultima_compra(LocalDate.now());

        Cliente result = service.update(1L, nuevo);

        assertEquals("Regular", result.getCategoria());
        assertEquals("Baja", result.getFrecuencia_compra());

        verify(repo).findById(1L);
        verify(repo).save(any());
    }

    @Test
    void testUpdateNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            service.update(99L, cliente);
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
        when(repo.findAll()).thenReturn(List.of(cliente));

        List<Cliente> result = controller.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void testControllerSave() {
        when(repo.save(any())).thenReturn(cliente);

        Cliente result = controller.save(cliente);

        assertEquals("Premium", result.getCategoria());
    }

    @Test
    void testControllerUpdate() {
        when(repo.findById(1L)).thenReturn(Optional.of(cliente));
        when(repo.save(any())).thenReturn(cliente);

        Cliente result = controller.update(1L, cliente);

        assertNotNull(result);
    }

    @Test
    void testControllerDelete() {
        doNothing().when(repo).deleteById(1L);

        controller.delete(1L);

        verify(repo).deleteById(1L);
    }
}