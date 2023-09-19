CREATE DATABASE casa_inteligente;

USE casa_inteligente;

CREATE TABLE usuarios(
    id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombres varchar(100) NOT NULL,
    apellidos varchar(100) NOT NULL
);

CREATE TABLE casa(
    id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ubicacion varchar(100) NOT NULL,
    estado TINYINT(1) DEFAULT 0
);