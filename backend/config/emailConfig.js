const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: true,
    tls: {
        rejectUnauthorized: false
    }
});


transporter.verify()
    .then(() => console.log('✅ Servidor de correo listo'))
    .catch(err => console.error('❌ Error en el servidor de correo:', err.message));

module.exports = transporter;

