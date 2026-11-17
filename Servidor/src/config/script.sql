CREATE DATABASE IF NOT EXISTS zoologico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zoologico;

-- Tabla de Usuarios con restricciones UNIQUE para username, email y teléfono
CREATE TABLE usuarios (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    rol ENUM('operador', 'administrador') DEFAULT 'operador',
    intentos_fallidos INT DEFAULT 0,
    bloqueado_hasta DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Zoológicos
CREATE TABLE zoos (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    ciudad VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    tamano DECIMAL(12,2) NOT NULL, -- en m2
    presupuesto_anual DECIMAL(15,2) NOT NULL,
    imagen VARCHAR(255) NULL
);

-- Tabla de Especies
CREATE TABLE especies (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_vulgar VARCHAR(100) NOT NULL,
    nombre_cientifico VARCHAR(150) NOT NULL UNIQUE,
    familia VARCHAR(100) NOT NULL,
    peligro_extincion BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabla de Animales
CREATE TABLE animales (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    zoo_codigo INT NOT NULL,
    especie_codigo INT NOT NULL,
    sexo ENUM('femenino', 'masculino') NOT NULL,
    anio_nacimiento INT NOT NULL,
    pais_origen VARCHAR(100) NOT NULL,
    continente VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) NULL,
    CONSTRAINT fk_animal_zoo FOREIGN KEY (zoo_codigo) REFERENCES zoos(codigo) ON DELETE RESTRICT,
    CONSTRAINT fk_animal_especie FOREIGN KEY (especie_codigo) REFERENCES especies(codigo) ON DELETE RESTRICT
);
