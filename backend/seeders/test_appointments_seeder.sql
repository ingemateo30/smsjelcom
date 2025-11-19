-- ==================================================
-- SEEDER: Datos de prueba para citas
-- Fecha: 2025-11-19
-- Propósito: Crear citas de prueba para mañana
-- ==================================================

-- IMPORTANTE: Este script crea citas para MAÑANA automáticamente
-- Para probar el sistema de cancelación de citas por WhatsApp

-- Limpiar datos de prueba anteriores (opcional)
-- DELETE FROM citas WHERE NOMBRE LIKE '%[PRUEBA]%';

-- Insertar citas de prueba para mañana
INSERT INTO citas (
  ATENCION,
  FECHA_CITA,
  HORA_CITA,
  SERVICIO,
  PROFESIONAL,
  TIPO_IDE_PACIENTE,
  NUMERO_IDE,
  NOMBRE,
  TELEFONO_FIJO,
  EMAIL,
  ESTADO
) VALUES
-- Cita 1: Medicina General
(
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY), -- Mañana
  '08:00:00',
  'MEDICINA GENERAL',
  'DR. JUAN PEREZ GOMEZ',
  'CC',
  '1000000001',
  'MARIA LOPEZ GARCIA [PRUEBA]',
  '3001234567',
  'maria.test@example.com',
  'pendiente'
),

-- Cita 2: Odontología
(
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY),
  '09:30:00',
  'ODONTOLOGIA',
  'DRA. ANA MARTINEZ RUIZ',
  'CC',
  '1000000002',
  'CARLOS RODRIGUEZ SANCHEZ [PRUEBA]',
  '3009876543',
  'carlos.test@example.com',
  'pendiente'
),

-- Cita 3: Cardiología
(
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY),
  '10:00:00',
  'CARDIOLOGIA',
  'DR. PEDRO GARCIA LOPEZ',
  'CC',
  '1000000003',
  'LUCIA FERNANDEZ TORRES [PRUEBA]',
  '3012345678',
  'lucia.test@example.com',
  'pendiente'
),

-- Cita 4: Pediatría
(
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY),
  '11:00:00',
  'PEDIATRIA',
  'DRA. SOFIA RAMIREZ GOMEZ',
  'TI',
  '1000000004',
  'JUAN CAMILO GONZALEZ DIAZ [PRUEBA]',
  '3004567890',
  'juan.test@example.com',
  'pendiente'
),

-- Cita 5: Dermatología
(
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY),
  '14:00:00',
  'DERMATOLOGIA',
  'DR. ANDRES CASTRO MORENO',
  'CC',
  '1000000005',
  'ANDREA JIMENEZ VARGAS [PRUEBA]',
  '3015678901',
  'andrea.test@example.com',
  'pendiente'
),

-- Cita 6: Psicología
(
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY),
  '15:30:00',
  'PSICOLOGIA',
  'PSI. LAURA MORALES CASTRO',
  'CC',
  '1000000006',
  'DIEGO MARTINEZ LOPEZ [PRUEBA]',
  '3026789012',
  'diego.test@example.com',
  'pendiente'
),

-- Cita 7: Nutrición
(
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY),
  '16:00:00',
  'NUTRICION',
  'NUT. CAMILA RUIZ SANCHEZ',
  'CC',
  '1000000007',
  'VALENTINA TORRES GARCIA [PRUEBA]',
  '3037890123',
  'valentina.test@example.com',
  'pendiente'
),

-- Cita 8: Oftalmología
(
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY),
  '08:30:00',
  'OFTALMOLOGIA',
  'DR. MIGUEL ANGEL VARGAS DIAZ',
  'CC',
  '1000000008',
  'SANTIAGO LOPEZ MARTINEZ [PRUEBA]',
  '3048901234',
  'santiago.test@example.com',
  'pendiente'
);

-- ==================================================
-- VERIFICACIÓN
-- ==================================================
-- Verificar que las citas se crearon correctamente
SELECT
  ID,
  NOMBRE,
  DATE_FORMAT(FECHA_CITA, '%Y-%m-%d') AS fecha,
  TIME_FORMAT(HORA_CITA, '%H:%i') AS hora,
  SERVICIO,
  TELEFONO_FIJO,
  ESTADO
FROM citas
WHERE NOMBRE LIKE '%[PRUEBA]%'
ORDER BY HORA_CITA;

-- ==================================================
-- NOTAS IMPORTANTES
-- ==================================================
-- 1. Todas estas citas tienen el sufijo [PRUEBA] para identificarlas fácilmente
-- 2. Los números de teléfono son ficticios (300xxxxxxx)
-- 3. Las citas se crean automáticamente para MAÑANA
-- 4. Para eliminar todas las citas de prueba, ejecuta:
--    DELETE FROM citas WHERE NOMBRE LIKE '%[PRUEBA]%';
