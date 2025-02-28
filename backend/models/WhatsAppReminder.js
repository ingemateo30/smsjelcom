const db = require("../config/db");

class WhatsAppReminder {
  static async getRemindersForTomorrow() {
    try {
        await db.execute("SET lc_time_names = 'es_ES';");
        const [rows] = await db.execute(`
            SELECT 
              ID AS id, 
              TELEFONO_FIJO AS telefono, 
              NOMBRE AS nombre_paciente, 
              DATE_FORMAT(CONVERT_TZ(FECHA_CITA, '+00:00', @@session.time_zone), '%W %d de %M de %Y') AS fecha, 
              DATE_FORMAT(HORA_CITA, '%h:%i %p') AS hora,
              SERVICIO AS servicio
            FROM citas 
            WHERE DATE(FECHA_CITA) = CURDATE() + INTERVAL 1 DAY 
            AND ESTADO = 'pendiente'
            LIMIT 90
          `);
      return rows;
    } catch (error) {
      console.error("❌ Error obteniendo citas:", error);
      throw error;
    }
  }

  // 🔹 Nueva función para actualizar el estado a "Enviado"
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
}

module.exports = WhatsAppReminder;




