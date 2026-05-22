package com.ferreteria.inventario.repository;

import com.ferreteria.inventario.model.Producto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository // <--- Asegúrate de que tenga esta anotación
public interface ProductoRepository extends MongoRepository<Producto, String> {
    Optional<Producto> findByCodigo(String codigo);

    List<Producto> findByCantidadLessThanEqual(int cantidad);
}