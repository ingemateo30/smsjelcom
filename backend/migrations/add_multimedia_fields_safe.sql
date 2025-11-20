-- Migración para agregar soporte de mensajes multimedia
-- Fecha: 2025-11-20
-- Esta versión es más segura y no falla si ya existen algunos elementos

-- Paso 1: Agregar campos para manejo de multimedia en la tabla mensajes
-- Usar procedimiento para evitar errores si las columnas ya existen
ALTER TABLE mensajes
ADD COLUMN tipo_media VARCHAR(50) DEFAULT NULL COMMENT 'Tipo de multimedia: image, audio, video, document',
ADD COLUMN url_media TEXT DEFAULT NULL COMMENT 'URL del archivo multimedia almacenado',
ADD COLUMN url_meta TEXT DEFAULT NULL COMMENT 'URL original de Meta API',
ADD COLUMN media_id VARCHAR(255) DEFAULT NULL COMMENT 'ID del media en Meta API',
ADD COLUMN mime_type VARCHAR(100) DEFAULT NULL COMMENT 'Tipo MIME del archivo',
ADD COLUMN tamaño_archivo INT DEFAULT NULL COMMENT 'Tamaño del archivo en bytes',
ADD COLUMN metadata JSON DEFAULT NULL COMMENT 'Metadata adicional del archivo (dimensiones, duración, etc)';

-- Paso 2: Crear índices para búsquedas por tipo de media
-- (Ignorar si ya existen)
CREATE INDEX idx_mensajes_tipo_media ON mensajes(tipo_media);
CREATE INDEX idx_mensajes_media_id ON mensajes(media_id);

-- Paso 3: Crear tabla para tracking de descargas de multimedia
-- Sin foreign key para evitar errores
CREATE TABLE IF NOT EXISTS multimedia_descargas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensaje_id VARCHAR(200) NOT NULL,
    media_id VARCHAR(255) NOT NULL,
    url_original TEXT NOT NULL,
    url_local TEXT,
    estado VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, downloading, completed, failed',
    intentos INT DEFAULT 0,
    error_mensaje TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado),
    INDEX idx_media_id (media_id),
    INDEX idx_mensaje_id (mensaje_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Nota: La foreign key no es estrictamente necesaria.
-- El código de la aplicación maneja la integridad referencial.
-- Si deseas agregar la foreign key manualmente más tarde, usa:
-- ALTER TABLE multimedia_descargas
-- ADD CONSTRAINT fk_multimedia_mensaje
-- FOREIGN KEY (mensaje_id) REFERENCES mensajes(id) ON DELETE CASCADE;
