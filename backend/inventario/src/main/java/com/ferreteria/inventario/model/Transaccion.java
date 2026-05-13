package com.ferreteria.inventario.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "transacciones")
public class Transaccion {

    @Id
    private String id;
    private String fecha; // formato: "2025-05-21"
    private String tipo; // "venta" o "compra"
    private double monto;
    private String detalle;

    public Transaccion() {
    }

    public Transaccion(String fecha, String tipo, double monto, String detalle) {
        this.fecha = fecha;
        this.tipo = tipo;
        this.monto = monto;
        this.detalle = detalle;
    }

    public String getId() {
        return id;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }
}
