package com.ferreteria.inventario.repository;

import com.ferreteria.inventario.model.Producto;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends MongoRepository<Producto, String> {
    Optional<Producto> findByCodigo(String codigo);

    List<Producto> findByCantidadLessThanEqual(int cantidad);
}
