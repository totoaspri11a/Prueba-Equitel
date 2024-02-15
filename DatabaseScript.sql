-- Database SCHEMA
CREATE TABLE Productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    modelo VARCHAR(100),
    cantidad_bodega INT NOT NULL,
    valor_venta DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor') NOT NULL
);

CREATE TABLE Ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_venta DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

CREATE TABLE Proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    direccion VARCHAR(255)
);

CREATE TABLE Detalle_Ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad_vendida INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id),
    FOREIGN KEY (id_producto) REFERENCES Productos(id)
);

CREATE TABLE Registro_Auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    accion_realizada TEXT NOT NULL,
    fecha_y_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);
