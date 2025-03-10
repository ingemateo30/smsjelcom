const db = require("../config/db");

class Config {
  static async getAll() {
    try {
      const [rows] = await db.execute("SELECT * FROM configuraciones");
      return rows;
    } catch (error) {
      console.error("Error al obtener todas las configuraciones:", error);
      throw error;
    }
  }

  static async getByKey(key) {
    try {
      const [rows] = await db.execute("SELECT valor FROM configuraciones WHERE clave = ?", [key]);
      return rows.length ? rows[0].valor : null;
    } catch (error) {
      console.error(`Error al obtener la configuración con clave '${key}':`, error);
      throw error;
    }
  }

  static async update(key, value) {
    try {
      const [result] = await db.execute(
        `INSERT INTO configuraciones (clave, valor) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE valor = VALUES(valor)`,
        [key, value]
      );
      return result;
    } catch (error) {
      console.error(`Error al actualizar la configuración con clave '${key}':`, error);
      throw error;
    }
  }
}

module.exports = Config;

