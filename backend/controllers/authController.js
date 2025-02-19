const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const User = require('../models/user');

exports.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.query(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor' });
            res.status(201).json({ message: 'Usuario registrado con éxito' });
        }
    );
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.buscarPorEmail(email);
        console.log('Usuario encontrado:', user); // <-- Verificar qué devuelve la consulta

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.id, rol: user.rol }, 'clave_secreta', { expiresIn: '1h' });

        console.log('Token generado:', token); // <-- Para verificar que el JWT tiene `rol`

        res.status(200).json({ 
            message: 'Login exitoso', 
            token, 
            rol: user.rol // <-- Asegurar que se devuelve el rol
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


