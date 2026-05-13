# 🔩 El Tornillo Feliz — Sistema de Gestión

> Sistema web de gestión de inventario y contabilidad para ferretería tradicional.

[![Deploy Status](https://img.shields.io/badge/Frontend-Netlify-00C7B7?logo=netlify)](https://tornillofeli.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=spring)](https://spring.io)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://mongodb.com)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk)](https://openjdk.org)

---

## 📌 Problema que Resuelve

Una ferretería tradicional gestionaba inventario y contabilidad con libretas y Excel, causando:
- Errores frecuentes en registros de stock
- Productos duplicados o sin seguimiento
- Pérdida de ingresos por falta de control
- Confusión contable (sin claridad de ganancias/pérdidas)

---

## ✅ Solución

Sistema web multiplataforma con:

| Módulo | Funcionalidades |
|--------|----------------|
| 🔐 Autenticación | Login seguro con roles |
| 📦 Inventario | CRUD completo de productos + alertas de stock bajo |
| 💰 Contabilidad | Registro de ventas y compras + balance |
| 📊 Reportes | Dashboard visual con gráficas y métricas |

---

## 🎥 Demo en Vivo

🌐 **[Ver Demo en Netlify →](https://tornillofeli.netlify.app)**

- Usuario: `admin`
- Contraseña: `admin123`

---

## 🏗️ Arquitectura

```
┌─────────────────┐       HTTP/REST       ┌──────────────────┐
│  Frontend       │ ──────────────────► │  Backend API     │
│  HTML/CSS/JS    │                      │  Spring Boot     │
│  Netlify        │ ◄────────────────── │  Render          │
└─────────────────┘       JSON           └────────┬─────────┘
                                                   │
                                                   ▼
                                         ┌──────────────────┐
                                         │   MongoDB Atlas  │
                                         │   (Cloud NoSQL)  │
                                         └──────────────────┘
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS |
| Backend API | Java 17 + Spring Boot 3.x |
| Base de datos | MongoDB Atlas (NoSQL) |
| Deploy Frontend | Netlify |
| Deploy Backend | Render |
| Control de versiones | GitHub |
| API Testing | Thunder Client / Postman |

---

## 📁 Estructura del Proyecto

```
ferreteria-tornillo-feliz/
├── frontend/                    # Demo desplegada en Netlify
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── backend/                     # API REST Spring Boot
    └── src/main/java/com/ferreteria/inventario/
        ├── InventarioApplication.java
        ├── model/
        │   ├── Producto.java
        │   └── Transaccion.java
        ├── repository/
        │   ├── ProductoRepository.java
        │   └── TransaccionRepository.java
        └── controller/
            ├── ProductoController.java
            └── TransaccionController.java
```

---

## 🚀 Cómo Ejecutar el Backend

### Prerrequisitos
- Java 17+
- Maven 3.8+
- MongoDB (local o Atlas)

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/ferreteria-tornillo-feliz.git
cd ferreteria-tornillo-feliz/backend
```

### 2. Configurar MongoDB
En `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb+srv://usuario:clave@cluster.mongodb.net/inventario
```

### 3. Compilar y ejecutar
```bash
mvn clean install
mvn spring-boot:run
```

La API estará en: `http://localhost:8080`

---

## 📡 Endpoints de la API

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/productos` | Listar todos los productos |
| `POST` | `/api/productos` | Crear nuevo producto |
| `PUT` | `/api/productos/{id}` | Actualizar producto |
| `DELETE` | `/api/productos/{id}` | Eliminar producto |
| `GET` | `/api/productos/bajo-stock` | Productos con stock bajo |

### Transacciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/transacciones` | Listar transacciones |
| `POST` | `/api/transacciones` | Registrar transacción |
| `DELETE` | `/api/transacciones/{id}` | Eliminar transacción |
| `GET` | `/api/transacciones/balance` | Balance total |

### Ejemplos de Request

**POST /api/productos**
```json
{
  "codigo": "P001",
  "nombre": "Martillo de Carpintero",
  "cantidad": 25,
  "precioUnitario": 32500
}
```

**POST /api/transacciones**
```json
{
  "fecha": "2025-05-21",
  "tipo": "venta",
  "detalle": "Venta de tornillos x50",
  "monto": 95000
}
```

---

## 📦 Modelos de Datos

### Producto
```json
{
  "_id": "ObjectId",
  "codigo": "P001",
  "nombre": "Martillo de Carpintero",
  "cantidad": 25,
  "precioUnitario": 32500
}
```

### Transacción
```json
{
  "_id": "ObjectId",
  "fecha": "2025-05-21",
  "tipo": "venta",
  "detalle": "Venta de tornillos x50",
  "monto": 95000
}
```

---

## 🎨 Capturas de Pantalla

> _Ver demo en vivo: [tornillofeli.netlify.app](https://tornillofeli.netlify.app)_

---

## 👨‍💻 Desarrollado por

**[Tu Nombre]** — Desarrollador Full Stack  
🌐 [Portafolio](https://portafolio-desarrollador.netlify.app) | 💼 [LinkedIn](#) | 🐙 [GitHub](#)

---

## 📄 Licencia

MIT License — libre para uso y modificación.