# Botica Nova Salud

Proyecto de gestión de inventario y ventas para la botica Nova Salud, desarrollado con arquitectura desacoplada: frontend en React y backend en Node.js + Express.

## 📌 Descripción

Esta aplicación permite administrar productos, controlar stock, registrar ventas, generar alertas de bajo stock y productos próximos a vencer, y gestionar usuarios con roles de `admin` y `vendedor`.

## 🧱 Estructura del proyecto

- `backend/`: servidor Node.js con Express, conexión a MySQL, autenticación y API REST.
- `frontend/`: aplicación React + Vite que consume la API del backend.

## 🚀 Tecnologías principales

- Backend: Node.js, Express, MySQL, bcryptjs, jsonwebtoken, google-auth-library
- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Google OAuth

## ✅ Características implementadas

- Inicio de sesión y registro de usuarios
- Inicio de sesión con Google
- Control de roles: `admin` y `vendedor`
- Gestión de productos (CRUD)
- Registro de ventas con descuento automático de stock
- Historial de ventas
- Alertas de bajo stock y productos próximos a vencer
- Dashboard con métricas básicas
- Protección de rutas con token JWT

## 📁 Estructura de carpetas

- `backend/src/app.js`: servidor principal y configuración de rutas
- `backend/src/controllers/`: lógica de controladores para auth, productos, ventas y alertas
- `backend/src/routes/`: rutas de la API
- `backend/src/middlewares/`: middleware de autenticación y roles
- `frontend/src/`: código fuente del cliente React
- `frontend/src/pages/`: vistas principales del sistema
- `frontend/src/components/`: componentes compartidos como la barra de navegación
- `frontend/src/services/api.js`: configuración de Axios

## ⚙️ Configuración local

### 1. Backend

1. Abrir terminal en `backend/`
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear archivo `.env` en `backend/` con estas variables:
   ```env
   PORT=3000
   DB_HOST=<tu_host_mysql>
   DB_PORT=3306
   DB_USER=<tu_usuario_mysql>
   DB_PASSWORD=<tu_contraseña_mysql>
   DB_NAME=Botica1
   JWT_SECRET=<una_clave_secreta>
   GOOGLE_CLIENT_ID=<tu_cliente_id_de_google>
   ```
4. Iniciar el backend:
   ```bash
   npm start
   ```

### 2. Frontend

1. Abrir terminal en `frontend/`
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el frontend:
   ```bash
   npm run dev
   ```

El frontend corre por defecto en `http://localhost:5173` y se conecta al backend en `http://localhost:3000`.

## 🔐 Variables de entorno necesarias

- `DB_HOST`: servidor MySQL
- `DB_PORT`: puerto MySQL (normalmente `3306`)
- `DB_USER`: usuario MySQL
- `DB_PASSWORD`: contraseña MySQL
- `DB_NAME`: nombre de la base de datos
- `JWT_SECRET`: clave para firmar tokens JWT
- `GOOGLE_CLIENT_ID`: Client ID de Google OAuth para login con Google

## 🧪 Comandos útiles

- Backend:
  - `npm start`: inicia el servidor
- Frontend:
  - `npm run dev`: inicia la app en modo desarrollo
  - `npm run build`: construye la app para producción
  - `npm run preview`: prueba la versión de producción

## 📌 Notas adicionales

- No subas el archivo `.env` ni credenciales privadas al repositorio.
- Ya se agregó un `.gitignore` para excluir `node_modules/`, `.env` y archivos sensibles.
- El proyecto ya está conectado al repositorio remoto en GitHub.

## 📍 Estado actual del proyecto

- Funcionalidad principal implementada
- Autenticación y roles listos
- Gestión de productos, ventas y alertas operativa
- Quedan mejoras opcionales como búsqueda avanzada y edición más completa de inventario

## 📎 Repositorio

https://github.com/yuberzmac/Botica1

---

**Autor:** Estudiante Senati

**Proyecto:** Botica Nova Salud
