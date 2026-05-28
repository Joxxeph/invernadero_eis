package co.usco.invernadero;

import co.usco.invernadero.controller.ProductoController;
import co.usco.invernadero.model.Producto;
import co.usco.invernadero.repository.ProductoRepository;
import co.usco.invernadero.service.ProductoService;

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
 * Propósito: Testing de controller, repositorio y service para producto
 */
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class ProductoTest {

    /**
    * Repositorio de Producto
    */
    @Mock
    private ProductoRepository repo;
    /**
    * Service de Producto
    */
    @InjectMocks
    private ProductoService service;
    /**
    * Controller de Producto
    */
    private ProductoController controller;
    /**
    * mock de Producto
    */
    private MockMvc mockMvc;
    /**
    * Modelo de Producto
    */
    private Producto producto;

    @BeforeEach
    void setUp() {
        controller = new ProductoController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        producto = new Producto();
        producto.setId(1L);
        producto.setId_cultivo(1);
        producto.setNombre("Tomate");
        producto.setDescripcion("Tomate rojo fresco");
        producto.setPrecio(new BigDecimal("2500"));
        producto.setUnidad_medida("kg");
        producto.setStock_actual(new BigDecimal("100"));
        producto.setStock_minimo(new BigDecimal("20"));
        producto.setCategoria("Hortaliza");
        producto.setFecha_cosecha(LocalDate.of(2026, 3, 10));
        producto.setFecha_vencimiento(LocalDate.of(2026, 4, 10));
        producto.setActivo(true);
    }

    // =========================
    // SERVICE TESTS
    // =========================

    @Test
    void testFindAll() {
        when(repo.findAll()).thenReturn(List.of(producto));

        List<Producto> result = service.findAll();

        assertEquals(1, result.size());
        verify(repo).findAll();
    }

    @Test
    void testSave() {
        when(repo.save(any())).thenReturn(producto);

        Producto result = service.save(producto);

        assertEquals("Tomate", result.getNombre());
        verify(repo).save(producto);
    }

    @Test
    void testUpdateSuccess() {
        when(repo.findById(1L)).thenReturn(Optional.of(producto));
        when(repo.save(any())).thenReturn(producto);

        Producto nuevo = new Producto();
        nuevo.setId_cultivo(2);
        nuevo.setNombre("Papa");
        nuevo.setDescripcion("Papa criolla");
        nuevo.setPrecio(new BigDecimal("3000"));
        nuevo.setUnidad_medida("kg");
        nuevo.setStock_actual(new BigDecimal("200"));
        nuevo.setStock_minimo(new BigDecimal("50"));
        nuevo.setCategoria("Tuberculo");
        nuevo.setFecha_cosecha(LocalDate.of(2026, 5, 1));
        nuevo.setFecha_vencimiento(LocalDate.of(2026, 6, 1));
        nuevo.setActivo(false);

        Producto result = service.update(1L, nuevo);

        assertEquals("Papa", result.getNombre());
        assertEquals("Tuberculo", result.getCategoria());

        verify(repo).findById(1L);
        verify(repo).save(any());
    }

    @Test
    void testUpdateNotFound() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            service.update(99L, producto);
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
        when(repo.findAll()).thenReturn(List.of(producto));

        List<Producto> result = controller.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void testControllerSave() {
        when(repo.save(any())).thenReturn(producto);

        Producto result = controller.save(producto);

        assertEquals("Tomate", result.getNombre());
    }

    @Test
    void testControllerUpdate() {
        when(repo.findById(1L)).thenReturn(Optional.of(producto));
        when(repo.save(any())).thenReturn(producto);

        Producto result = controller.update(1L, producto);

        assertNotNull(result);
    }

    @Test
    void testControllerDelete() {
        doNothing().when(repo).deleteById(1L);

        controller.delete(1L);

        verify(repo).deleteById(1L);
    }
}