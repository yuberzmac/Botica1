# Botica Nova Salud

> Aplicación web de gestión de inventario y ventas para la botica Nova Salud.

---

## 📌 Índice

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Rutas principales de la API](#rutas-principales-de-la-api)
- [Estado actual](#estado-actual)
- [Notas importantes](#notas-importantes)

---

## 📌 Descripción

Botica Nova Salud es un sistema web desarrollado con frontend en React y backend en Node.js + Express. Permite:

- Registrar y autenticar usuarios
- Gestionar productos y stock
- Registrar ventas y descontar inventario automáticamente
- Visualizar alertas de bajo stock y vencimientos
- Controlar accesos según rol (`admin` / `vendedor`)

---

## 🚀 Tecnologías

| Frontend | Backend |
| --- | --- |
| React | Node.js
| Vite | Express
| Tailwind CSS | MySQL
| React Router | bcryptjs
| Axios | jsonwebtoken
| @react-oauth/google | google-auth-library

---

## ✅ Características

- Login + registro de usuario
- Login con Google
- Roles de usuario (`admin`, `vendedor`)
- CRUD de productos
- Registro de ventas con cálculo automático del total
- Descuento automático de stock en ventas
- Historial de ventas
- Alertas de bajo stock
- Alertas de productos próximos a vencer
- Dashboard con métricas principales
- Rutas protegidas con JWT

---

## 📁 Estructura del proyecto

### Backend

- `backend/src/app.js` - servidor y rutas principales
- `backend/src/controllers/` - lógica de negocio
- `backend/src/routes/` - rutas de API
- `backend/src/middlewares/` - autenticación y control de roles
- `backend/src/config/db.js` - configuración de conexión con MySQL

### Frontend

- `frontend/src/App.jsx` - enrutamiento principal
- `frontend/src/pages/` - vistas: login, registro, productos, ventas, alertas, dashboard
- `frontend/src/components/` - componentes compartidos
- `frontend/src/services/api.js` - configuración de Axios y autorización

---

## ⚙️ Instalación y ejecución

### Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en `backend/` con estas variables:

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

Iniciar backend:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecuta en `http://localhost:5173` y usa la API en `http://localhost:3000`.

---

## 🔐 Variables de entorno

- `DB_HOST`: Host de la base de datos MySQL
- `DB_PORT`: Puerto de MySQL (`3306`)
- `DB_USER`: Usuario MySQL
- `DB_PASSWORD`: Contraseña MySQL
- `DB_NAME`: Nombre de la base de datos
- `JWT_SECRET`: Clave para tokens JWT
- `GOOGLE_CLIENT_ID`: ID de cliente de Google OAuth

---

## 🧭 Rutas principales de la API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/login` | Login con correo y contraseña |
| `POST` | `/auth/google-login` | Login con Google |
| `GET` | `/productos` | Listar productos |
| `GET` | `/productos/:id` | Obtener producto por ID |
| `POST` | `/productos` | Crear producto |
| `PUT` | `/productos/:id` | Actualizar producto |
| `DELETE` | `/productos/:id` | Eliminar producto |
| `POST` | `/ventas` | Registrar venta |
| `GET` | `/ventas` | Listar ventas |
| `GET` | `/alertas` | Obtener alertas de inventario |

---

## 📍 Estado actual

- ✅ Backend funcional
- ✅ Frontend funcional
- ✅ Autenticación y roles implementados
- ✅ Gestión de inventario y ventas operativa
- ✅ Alertas y dashboard disponibles

---

## 📌 Notas importantes

- No subas el archivo `.env` al repositorio.
- Se excluyen `node_modules/` y archivos sensibles en `.gitignore`.
- El repositorio remoto ya está configurado en GitHub.

---

## 📎 Repositorio

https://github.com/yuberzmac/Botica1

---

**Autor:** Estudiante Senati

**Proyecto:** Botica Nova Salud
