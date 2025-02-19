const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'msalazar5@udi.edu.co',
        pass: 'M1005450340s@' // Usa variables de entorno para mayor seguridad
    }
});

module.exports = transporter;
