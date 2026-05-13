package com.ferreteria.inventario.controller;

import com.ferreteria.inventario.model.Producto;
import com.ferreteria.inventario.repository.ProductoRepository;
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
        return ResponseEntity.ok(repository.save(producto));
    }

    // PUT actualizar
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable String id, @RequestBody Producto datos) {
        return repository.findById(id).map(prod -> {
            prod.setCodigo(datos.getCodigo());
            prod.setNombre(datos.getNombre());
            prod.setCantidad(datos.getCantidad());
            prod.setPrecioUnitario(datos.getPrecioUnitario());
            return ResponseEntity.ok(repository.save(prod));
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