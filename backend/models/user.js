const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    constructor(nombre, email, password, rol, estado = 'activo') {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.estado = estado;
    }

    async guardar() {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)',
                [this.nombre, this.email, hashedPassword, this.rol || 'usuario', this.estado],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static buscarPorEmail(email) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT id, nombre, email, password, rol, estado FROM usuarios WHERE email = ?', 
                [email], 
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result[0]);
                }
            );
        });
    }

    static actualizarEstado(id, nuevoEstado) {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE usuarios SET estado = ? WHERE id = ?',
                [nuevoEstado, id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static listarUsuarios() {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, nombre, email, rol, estado FROM usuarios', (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

}

module.exports = User;
;
