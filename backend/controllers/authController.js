const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

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

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ message: 'Credenciales inválidas' });

        const validPassword = await bcrypt.compare(password, results[0].password);
        if (!validPassword) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign({ id: results[0].id, rol: results[0].rol }, 'clave_secreta', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', token });
    });
};


