package com.ferreteria.inventario.repository;

import com.ferreteria.inventario.model.Transaccion;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransaccionRepository extends MongoRepository<Transaccion, String> {
    List<Transaccion> findByTipo(String tipo);

    List<Transaccion> findByFechaBetween(String fechaInicio, String fechaFin);
}
