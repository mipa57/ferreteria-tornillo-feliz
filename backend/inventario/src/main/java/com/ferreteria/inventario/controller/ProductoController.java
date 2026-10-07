package com.ferreteria.inventario.controller;

import com.ferreteria.inventario.model.Producto;
import com.ferreteria.inventario.repository.ProductoRepository;
import com.ferreteria.inventario.service.N8nNotificationService; // <-- Se agregó el import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoRepository repository;

    @Autowired
    private N8nNotificationService n8nNotificationService;

    // GET todos
    @GetMapping
    public List<Producto> obtenerTodos() {
        return repository.findAll();
    }

    // GET stock bajo (cantidad <= 5)
    @GetMapping("/bajo-stock")
    public List<Producto> bajStock() {
        return repository.findByCantidadLessThanEqual(5);
    }

    // POST crear
    @PostMapping
    public ResponseEntity<?> agregar(@RequestBody Producto producto) {
        Optional<Producto> existente = repository.findByCodigo(producto.getCodigo());
        if (existente.isPresent()) {
            return ResponseEntity.badRequest().body("Error: ya existe un producto con ese codigo.");
        }
        
        Producto guardado = repository.save(producto);

        // Disparar alerta si ingresa con stock crítico
        if (guardado.getCantidad() <= 5) {
            n8nNotificationService.enviarAlertaStockBajo(
                guardado.getNombre(),
                guardado.getCodigo(),
                guardado.getCantidad(),
                5,
                "Herramientas Industrias S.A."
            );
        }

        return ResponseEntity.ok(guardado);
    }

    // PUT actualizar (ÚNICO método de actualización)
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable String id, @RequestBody Producto datos) {
        return repository.findById(id).map(prod -> {
            prod.setCodigo(datos.getCodigo());
            prod.setNombre(datos.getNombre());
            prod.setCantidad(datos.getCantidad());
            prod.setPrecioUnitario(datos.getPrecioUnitario());

            Producto actualizado = repository.save(prod);

            // Disparar alerta si la cantidad baja a 5 o menos
            if (actualizado.getCantidad() <= 5) {
                n8nNotificationService.enviarAlertaStockBajo(
                    actualizado.getNombre(),
                    actualizado.getCodigo(),
                    actualizado.getCantidad(),
                    5,
                    "Herramientas Industrias S.A."
                );
            }

            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok("Producto eliminado.");
    }
}