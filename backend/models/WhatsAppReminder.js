const db = require("../config/db");

class WhatsAppReminder {
  static async getRemindersForTomorrow() {
    try {
        await db.execute("SET lc_time_names = 'es_ES';");
        const [rows] = await db.execute(`
          SELECT ID AS id, TELEFONO_FIJO AS telefono, NOMBRE AS nombre_paciente, DATE_FORMAT(FECHA_CITA, '%W %d de %M de %Y') AS fecha, DATE_FORMAT(HORA_CITA, '%h:%i %p') AS hora, SERVICIO AS servicio,PROFESIONAL as profesional FROM citas WHERE DATE(FECHA_CITA) = DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND ESTADO = 'pendiente'; 
          `);
      return rows;
    } catch (error) {
      console.error("❌ Error obteniendo citas:", error);
      throw error;
    }
  }

  static async updateReminderStatus(id, estado) {
    try {
      await db.execute(
        `UPDATE citas SET ESTADO = ? WHERE ID = ?`,
        [estado, id]
      );
      console.log(`🔄 Estado actualizado a "${estado}" para la cita con ID: ${id}`);
    } catch (error) {
      console.error(`❌ Error actualizando estado de la cita ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener cita por ID
   */
  static async getCitaById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM citas WHERE ID = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error(`❌ Error obteniendo cita ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener cita por teléfono para una fecha específica
   */
  static async getCitaByPhoneAndDate(telefono, fecha) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM citas
         WHERE TELEFONO_FIJO = ?
         AND DATE(FECHA_CITA) = ?
         AND ESTADO IN ('pendiente', 'recordatorio enviado')
         LIMIT 1`,
        [telefono, fecha]
      );
      return rows[0] || null;
    } catch (error) {
      console.error(`❌ Error obteniendo cita por teléfono:`, error);
      throw error;
    }
  }

  /**
   * Cancelar cita
   */
  static async cancelarCita(id, motivo, canceladoPor = 'paciente') {
    try {
      await db.execute(
        `UPDATE citas
         SET ESTADO = 'cancelada',
             MOTIVO_CANCELACION = ?,
             FECHA_CANCELACION = NOW(),
             CANCELADO_POR = ?
         WHERE ID = ?`,
        [motivo, canceladoPor, id]
      );
      console.log(`✅ Cita ID ${id} cancelada por ${canceladoPor}`);
      return true;
    } catch (error) {
      console.error(`❌ Error cancelando cita ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de cancelaciones
   */
  static async getEstadisticasCancelaciones() {
    try {
      const [stats] = await db.execute(`
        SELECT
          COUNT(*) as total_canceladas,
          SUM(CASE WHEN DATE(FECHA_CANCELACION) = CURDATE() THEN 1 ELSE 0 END) as canceladas_hoy,
          SUM(CASE WHEN CANCELADO_POR = 'paciente' THEN 1 ELSE 0 END) as canceladas_paciente,
          SUM(CASE WHEN CANCELADO_POR = 'sistema' THEN 1 ELSE 0 END) as canceladas_sistema,
          SUM(CASE WHEN CANCELADO_POR = 'administrador' THEN 1 ELSE 0 END) as canceladas_admin
        FROM citas
        WHERE ESTADO = 'cancelada'
        AND FECHA_CANCELACION >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      `);
      return stats[0];
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de cancelaciones:', error);
      throw error;
    }
  }

  /**
   * Obtener citas canceladas recientes
   */
  static async getCitasCanceladasRecientes(limite = 20) {
    try {
      const [rows] = await db.execute(
        `SELECT
           ID,
           NOMBRE,
           SERVICIO,
           PROFESIONAL,
           DATE_FORMAT(FECHA_CITA, '%Y-%m-%d %H:%i') as fecha_cita,
           DATE_FORMAT(FECHA_CANCELACION, '%Y-%m-%d %H:%i') as fecha_cancelacion,
           MOTIVO_CANCELACION,
           CANCELADO_POR
         FROM citas
         WHERE ESTADO = 'cancelada'
         ORDER BY FECHA_CANCELACION DESC
         LIMIT ?`,
        [limite]
      );
      return rows;
    } catch (error) {
      console.error('❌ Error obteniendo citas canceladas recientes:', error);
      throw error;
    }
  }
}

module.exports = WhatsAppReminder;




