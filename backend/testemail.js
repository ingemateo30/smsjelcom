const transporter = require('./config/emailConfig');

async function testEmail() {
    try {
        const info = await transporter.sendMail({
            from: 'no-reply@jelcom.com',
            to: 'msalazar5@udi.edu.co',
            subject: 'Prueba de envío',
            text: 'Este es un correo de prueba'
        });

        console.log('Correo enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

testEmail();
