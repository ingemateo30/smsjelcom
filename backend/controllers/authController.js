const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const User = require('../models/user');
const transporter = require('../config/emailConfig'); // Para enviar correos
const crypto = require('crypto');

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
        console.log('Usuario encontrado:', user);

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        
        if (user.estado === 'inactivo') {
            return res.status(403).json({ message: 'Tu cuenta está inactiva. Contacta al administrador.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.id, rol: user.rol }, 'clave_secreta', { expiresIn: '1h' });

        console.log('Token generado:', token);

        res.status(200).json({ 
            message: 'Login exitoso', 
            token, 
            rol: user.rol,
            estado: user.estado
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.solicitarRecuperacion = async (req, res) => {
    const { email } = req.body;
    
    try {
        console.log(`Buscando usuario con email: ${email}`);
        const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (rows.length === 0) {
            console.log("Correo no encontrado en la base de datos.");
            return res.status(404).json({ message: 'El correo no está registrado' });
        }

        const usuario = rows[0];

        // Generar token único
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = new Date(Date.now() + 3600000); // 1 hora de validez

        console.log("Guardando token en la base de datos...");
        await db.promise().query(
            'UPDATE usuarios SET reset_token = ?, reset_token_expiration = ? WHERE email = ?', 
            [resetToken, tokenExpiration, email]
        );

        // Enviar correo con el enlace de recuperación
        const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;
        console.log("Enviando correo a:", email);

        await transporter.sendMail({
            from: 'no-reply@jelcom.com',
            to: email,
            subject: 'Recuperación de Contraseña',
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                   <a href="${resetLink}">${resetLink}</a>`
        });

        console.log("Correo enviado correctamente.");
        res.json({ message: 'Correo de recuperación enviado' });

    } catch (error) {
        console.error("❌ Error en la recuperación de contraseña:", error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

exports.resetearPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expiration > NOW()', [token]);
        const usuario = rows[0]; 

        if (!usuario) return res.status(400).json({ message: 'Token inválido o expirado' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.promise().query(
            'UPDATE usuarios SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE id = ?', 
            [hashedPassword, usuario.id]
        );

        res.json({ message: 'Contraseña restablecida correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (estado !== "activo" && estado !== "inactivo") {
            return res.status(400).json({ message: "Estado inválido" });
        }

        await User.actualizarEstado(id, estado);
        res.json({ message: `Usuario ${estado} correctamente` });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado", error });
    }
};

