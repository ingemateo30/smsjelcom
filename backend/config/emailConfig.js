const nodemailer = require('nodemailer');
require('dotenv').config(); // Carga variables de entorno

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Nunca hardcodear credenciales
    },
    secure: true, // Usa SSL/TLS para mayor seguridad
    tls: {
        rejectUnauthorized: false // Evita problemas con certificados en servidores nuevos
    }
});

// Verificar conexión con el servidor de correos
transporter.verify()
    .then(() => console.log('✅ Servidor de correo listo'))
    .catch(err => console.error('❌ Error en el servidor de correo:', err.message));

module.exports = transporter;

