const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    constructor(nombre, email, password, rol = 'usuario', estado = 'activo') {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.estado = estado;
    }

    async guardar() {
        try {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            const [result] = await db.query(  // ❌ QUITAR .promise()
                'INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)',
                [this.nombre, this.email, hashedPassword, this.rol, this.estado]
            );
            return result;
        } catch (error) {
            throw new Error('Error al guardar el usuario: ' + error.message);
        }
    }

    static async buscarPorEmail(email) {
        try {
            const [result] = await db.query(  // ❌ QUITAR .promise()
                'SELECT id, nombre, email, password, rol, estado FROM usuarios WHERE email = ?',
                [email]
            );
            return result.length ? result[0] : null;
        } catch (error) {
            throw new Error('Error al buscar usuario por email: ' + error.message);
        }
    }

    static async actualizarEstado(id, nuevoEstado) {
        try {
            const [result] = await db.query(  // ❌ QUITAR .promise()
                'UPDATE usuarios SET estado = ? WHERE id = ?',
                [nuevoEstado, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar el estado del usuario: ' + error.message);
        }
    }

    static async listarUsuarios() {
        try {
            const [result] = await db.query(  // ❌ QUITAR .promise()
                'SELECT id, nombre, email, rol, estado FROM usuarios'
            );
            return result;
        } catch (error) {
            throw new Error('Error al listar los usuarios: ' + error.message);
        }
    }
}

module.exports = User;



