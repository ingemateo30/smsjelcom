const db = require('../config/db.js');

const crearCita = async (nombre, fecha) => {
  try {
    const [result] = await db.query('INSERT INTO citas (nombre, fecha) VALUES (?, ?)', [nombre, fecha]);
    return result.insertId;
  } catch (error) {
    console.error('Error al crear la cita:', error);
    throw error;
  }
};

// Obtener todas las citas
const obtenerCitas = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM citas');
    return rows;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    throw error;
  }
};

// Obtener una cita por ID
const obtenerCitaPorId = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM citas WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener la cita:', error);
    throw error;
  }
};

// Actualizar una cita
const actualizarCita = async (id, nombre, fecha) => {
  try {
    const [result] = await db.query('UPDATE citas SET nombre = ?, fecha = ? WHERE id = ?', [nombre, fecha, id]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    throw error;
  }
};

// Eliminar una cita
const eliminarCita = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM citas WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error al eliminar la cita:', error);
    throw error;
  }
};

// Exportar funciones
module.exports = {
  crearCita,
  obtenerCitas,
  obtenerCitaPorId,
  actualizarCita,
  eliminarCita
};

