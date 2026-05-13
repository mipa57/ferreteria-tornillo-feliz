package com.ferreteria.inventario.controller;

import com.ferreteria.inventario.model.Transaccion;
import com.ferreteria.inventario.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacciones")
@CrossOrigin(origins = "*")
public class TransaccionController {

    @Autowired
    private TransaccionRepository repository;

    // GET todas
    @GetMapping
    public List<Transaccion> obtenerTodas() {
        return repository.findAll();
    }

    // GET por tipo: /api/transacciones?tipo=venta
    @GetMapping("/tipo/{tipo}")
    public List<Transaccion> porTipo(@PathVariable String tipo) {
        return repository.findByTipo(tipo);
    }

    // GET balance: ingresos - egresos
    @GetMapping("/balance")
    public ResponseEntity<?> balance() {
        List<Transaccion> todas = repository.findAll();
        double ingresos = todas.stream()
                .filter(t -> "venta".equals(t.getTipo()))
                .mapToDouble(Transaccion::getMonto).sum();
        double egresos = todas.stream()
                .filter(t -> "compra".equals(t.getTipo()))
                .mapToDouble(Transaccion::getMonto).sum();
        return ResponseEntity.ok(Map.of(
                "ingresos", ingresos,
                "egresos", egresos,
                "neto", ingresos - egresos));
    }

    // POST registrar
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Transaccion transaccion) {
        if (transaccion.getMonto() <= 0) {
            return ResponseEntity.badRequest().body("El monto debe ser mayor a 0.");
        }
        if (!"venta".equals(transaccion.getTipo()) && !"compra".equals(transaccion.getTipo())) {
            return ResponseEntity.badRequest().body("El tipo debe ser 'venta' o 'compra'.");
        }
        return ResponseEntity.ok(repository.save(transaccion));
    }

    // DELETE eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable String id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok("Transaccion eliminada.");
    }
}