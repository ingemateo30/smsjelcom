const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    constructor(nombre, email, password, rol) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

    async guardar() {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
                [this.nombre, this.email, hashedPassword, this.rol || 'usuario'],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static buscarPorEmail(email) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });
    }
}

module.exports = User;
