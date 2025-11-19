-- ==================================================
-- MIGRACIÓN: Agregar campos de cancelación a citas
-- Fecha: 2025-11-19
-- ==================================================

-- 1. Agregar campos de cancelación a la tabla citas
ALTER TABLE citas
ADD COLUMN MOTIVO_CANCELACION TEXT DEFAULT NULL,
ADD COLUMN FECHA_CANCELACION DATETIME DEFAULT NULL,
ADD COLUMN CANCELADO_POR VARCHAR(50) DEFAULT NULL COMMENT 'paciente/sistema/administrador';

-- 2. Actualizar valores posibles de ESTADO
ALTER TABLE citas
MODIFY COLUMN ESTADO VARCHAR(50) DEFAULT 'pendiente'
COMMENT 'pendiente/recordatorio enviado/confirmada/cancelada';

-- 3. Crear tabla para conversaciones de WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_conversaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(20) NOT NULL,
  cita_id INT NOT NULL,
  estado_conversacion VARCHAR(50) NOT NULL DEFAULT 'esperando_respuesta'
    COMMENT 'esperando_respuesta/esperando_motivo/completada/cancelada',
  mensaje_id VARCHAR(255) DEFAULT NULL COMMENT 'ID del mensaje de WhatsApp de Meta',
  ultimo_mensaje TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cita_id) REFERENCES citas(ID) ON DELETE CASCADE,
  INDEX idx_telefono (telefono),
  INDEX idx_estado (estado_conversacion),
  INDEX idx_cita_id (cita_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Aplicar cambios a citas_historico también
ALTER TABLE citas_historico
ADD COLUMN IF NOT EXISTS MOTIVO_CANCELACION TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS FECHA_CANCELACION DATETIME DEFAULT NULL,
ADD COLUMN IF NOT EXISTS CANCELADO_POR VARCHAR(50) DEFAULT NULL;

-- 5. Crear índices para mejorar consultas de cancelaciones
CREATE INDEX idx_estado_fecha ON citas(ESTADO, FECHA_CITA);
CREATE INDEX idx_cancelacion ON citas(FECHA_CANCELACION);

-- ==================================================
-- VERIFICACIÓN
-- ==================================================
-- Ejecuta esto para verificar que la migración fue exitosa:
-- SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT
-- FROM INFORMATION_SCHEMA.COLUMNS
-- WHERE TABLE_NAME = 'citas' AND COLUMN_NAME LIKE '%CANCEL%';
