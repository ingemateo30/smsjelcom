const express = require('express');
const router = express.Router();
const db = require('../config/db.js');

router.get('/stats', async (req, res) => {
  try {
    const [stats] = await db.query(`
     SELECT
       (SELECT COUNT(*) FROM citas WHERE DATE(fecha_cita) = CURDATE() + INTERVAL 1 DAY) AS sms_enviados,
       (SELECT COUNT(*) FROM citas_historico WHERE DATE(fecha_cita) = CURDATE()) AS citas_programadas,
       (SELECT COUNT(*) FROM citas_historico WHERE estado = 'recordatorio enviado') AS confirmaciones,
       (SELECT COUNT(*) FROM citas WHERE estado = 'cancelada') AS cancelaciones_total,
       (SELECT COUNT(*) FROM citas WHERE estado = 'cancelada' AND DATE(FECHA_CANCELACION) = CURDATE()) AS cancelaciones_hoy
    `);

    const [enviosPorHora] = await db.query(`
      SELECT HOUR(fecha_cita) AS hora, COUNT(*) AS enviados
      FROM citas_historico
      WHERE DATE(fecha_cita) = CURDATE()
      GROUP BY hora
    `);

    const [estadoMensajes] = await db.query(`
      SELECT estado AS nombre, COUNT(*) AS valor
      FROM citas_historico
      WHERE MONTH(fecha_cita) = MONTH(CURDATE())
      GROUP BY estado
    `);

    const [respuestasPacientes] = await db.query(`
      SELECT MONTHNAME(fecha_cita) AS mes,
        SUM(estado = 'recordatorio enviado') AS confirmados,
        SUM(estado = 'cancelada') AS cancelados
      FROM citas_historico
      WHERE YEAR(fecha_cita) = YEAR(CURDATE())
      GROUP BY MONTH(fecha_cita)
      ORDER BY MONTH(fecha_cita)
    `);

    const [smsPorDia] = await db.query(`
      SELECT DATE(fecha_cita) as fecha, COUNT(*) as enviados
      FROM citas_historico
      WHERE fecha_cita >= CURDATE() - INTERVAL 7 DAY and estado = 'recordatorio enviado'
      GROUP BY fecha
    `);

    const [porcentajeNoContactados] = await db.query(`
      SELECT
        (SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS porcentaje_no_contactados
      FROM citas_historico
      WHERE DATE(fecha_cita) = CURDATE()
    `);

    const [rankingConfirmaciones] = await db.query(`
      SELECT
        DAYNAME(fecha_cita) AS dia,
        COUNT(*) AS confirmaciones
      FROM citas_historico
      WHERE estado = 'recordatorio enviado' AND fecha_cita >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY dia
      ORDER BY FIELD(dia, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')
    `);

    // Nuevas consultas para cancelaciones
    const [citasCanceladas] = await db.query(`
      SELECT
        ID,
        NOMBRE,
        SERVICIO,
        DATE_FORMAT(FECHA_CITA, '%Y-%m-%d') as fecha,
        TIME_FORMAT(HORA_CITA, '%H:%i') as hora,
        PROFESIONAL,
        MOTIVO_CANCELACION,
        DATE_FORMAT(FECHA_CANCELACION, '%Y-%m-%d %H:%i') as fecha_cancelacion,
        CANCELADO_POR
      FROM citas
      WHERE estado = 'cancelada'
      AND DATE(FECHA_CANCELACION) >= CURDATE() - INTERVAL 7 DAY
      ORDER BY FECHA_CANCELACION DESC
      LIMIT 50
    `);

    const [motivosCancelacion] = await db.query(`
      SELECT
        CASE
          WHEN MOTIVO_CANCELACION LIKE '%enferm%' OR MOTIVO_CANCELACION LIKE '%salud%' THEN 'Problemas de salud'
          WHEN MOTIVO_CANCELACION LIKE '%trabajo%' OR MOTIVO_CANCELACION LIKE '%ocupado%' THEN 'Trabajo/Ocupado'
          WHEN MOTIVO_CANCELACION LIKE '%viaje%' OR MOTIVO_CANCELACION LIKE '%fuera%' THEN 'Viaje'
          WHEN MOTIVO_CANCELACION LIKE '%personal%' OR MOTIVO_CANCELACION LIKE '%familia%' THEN 'Asuntos personales'
          WHEN MOTIVO_CANCELACION LIKE '%reagendar%' OR MOTIVO_CANCELACION LIKE '%reprogramar%' THEN 'Reagendar'
          ELSE 'Otros motivos'
        END as categoria,
        COUNT(*) as cantidad
      FROM citas
      WHERE estado = 'cancelada'
      AND FECHA_CANCELACION >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY categoria
      ORDER BY cantidad DESC
    `);

    const [cancelacionesPorDia] = await db.query(`
      SELECT
        DATE(FECHA_CANCELACION) as fecha,
        COUNT(*) as cantidad
      FROM citas
      WHERE estado = 'cancelada'
      AND FECHA_CANCELACION >= CURDATE() - INTERVAL 7 DAY
      GROUP BY fecha
      ORDER BY fecha
    `);

    const [tasaCancelacion] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM citas WHERE estado = 'cancelada' AND MONTH(FECHA_CANCELACION) = MONTH(CURDATE())) as canceladas,
        (SELECT COUNT(*) FROM citas WHERE MONTH(FECHA_CITA) = MONTH(CURDATE())) as total,
        ROUND(
          (SELECT COUNT(*) FROM citas WHERE estado = 'cancelada' AND MONTH(FECHA_CANCELACION) = MONTH(CURDATE())) * 100.0 /
          (SELECT COUNT(*) FROM citas WHERE MONTH(FECHA_CITA) = MONTH(CURDATE()))
        , 2) as tasa_cancelacion
    `);

    res.json({
      stats: stats[0],
      enviosPorHora,
      estadoMensajes,
      respuestasPacientes,
      smsPorDia,
      porcentajeNoContactados: porcentajeNoContactados[0],
      rankingConfirmaciones,
      // Nuevos datos de cancelaciones
      citasCanceladas,
      motivosCancelacion,
      cancelacionesPorDia,
      tasaCancelacion: tasaCancelacion[0]
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
});

module.exports = router;

