package com.ferreteria.inventario.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class N8nNotificationService {

    @Value("${n8n.webhook.inventario-url}")
    private String n8nWebhookUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void enviarAlertaStockBajo(String producto, String codigo, int stockActual, int stockMinimo, String proveedor) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("producto", producto);
            payload.put("codigo", codigo);
            payload.put("stock_actual", stockActual);
            payload.put("stock_minimo", stockMinimo);
            payload.put("proveedor", proveedor);

            // Se envía el JSON a n8n
            restTemplate.postForEntity(n8nWebhookUrl, payload, String.class);
            System.out.println("Alerta de stock enviada exitosamente a n8n para: " + producto);
        } catch (Exception e) {
            System.err.println("Error al conectar con el Webhook de n8n: " + e.getMessage());
        }
    }
}