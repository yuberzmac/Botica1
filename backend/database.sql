DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL DEFAULT 2,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  precio DECIMAL(10,2) NOT NULL,
  fecha_vencimiento DATE
);

CREATE TABLE ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar roles por defecto
INSERT INTO roles (nombre) VALUES ('admin'), ('vendedor');

-- Insertar un usuario administrador por defecto (password es admin123)
-- La contraseña está encriptada con bcrypt
-- rol_id 1 = admin
INSERT INTO usuarios (nombre_completo, correo, telefono, password, rol_id) 
VALUES ('Administrador General', 'admin@novasalud.com', '999888777', '$2a$10$wY9d6JkE3Xb5g0V4aN6L9O4tUq6wB3uC0aLzF3Zt1yX5jQ5eW4pM2', 1);
