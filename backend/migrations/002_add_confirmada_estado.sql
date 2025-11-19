-- ==================================================
-- MIGRACIÓN: Agregar estado 'confirmada' a conversaciones
-- Fecha: 2025-11-19
-- ==================================================

-- Actualizar el comentario de estado_conversacion para incluir 'confirmada'
ALTER TABLE whatsapp_conversaciones
MODIFY COLUMN estado_conversacion VARCHAR(50) NOT NULL DEFAULT 'esperando_respuesta'
  COMMENT 'esperando_respuesta/esperando_motivo/completada/confirmada/cancelada';

-- ==================================================
-- VERIFICACIÓN
-- ==================================================
-- Ejecuta esto para verificar que la migración fue exitosa:
-- SELECT COLUMN_NAME, COLUMN_COMMENT
-- FROM INFORMATION_SCHEMA.COLUMNS
-- WHERE TABLE_NAME = 'whatsapp_conversaciones' AND COLUMN_NAME = 'estado_conversacion';
