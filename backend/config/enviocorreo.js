const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Configurar en el archivo .env
        pass: process.env.EMAIL_PASS,  // Configurar en el archivo .env
    },
});

// Función para enviar correos
const sendEmail = async (options) => {
    try {
        await transporter.sendMail({
            from: `"HOSPITAL REGIONAL DE SANGIL" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
        });
        console.log(`📧 Correo enviado a: ${options.to}`);
    } catch (error) {
        console.error("❌ Error al enviar el correo:", error);
    }
};

module.exports = sendEmail;
