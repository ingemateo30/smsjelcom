const db = require("../config/db");

class WhatsAppReminder {
  static async getRemindersForTomorrow() {
    try {
      const [rows] = await db.execute(`
        SELECT TELEFONO_FIJO AS telefono, NOMBRE AS nombre_paciente, 
        CONCAT(FECHA_CITA, ' ', HORA_CITA) AS fecha 
        FROM citas 
        WHERE DATE(FECHA_CITA) = CURDATE() + INTERVAL 1 DAY 
        AND ESTADO = 'pendiente'
        LIMIT 100
      `);
      return rows;
    } catch (error) {
      console.error("Error obteniendo citas:", error);
      throw error;
    }
  }
}

module.exports = WhatsAppReminder;

