const { apiKey, sender } = require("../config/labsmobileConfig");
const db = require("../config/db");
require('dotenv').config();
const LabsMobileClient = require("labsmobile-sms/src/LabsMobileClient");
const LabsMobileModelTextMessage = require("labsmobile-sms/src/LabsMobileModelTextMessage");
const ParametersException = require("labsmobile-sms/src/Exception/ParametersException");
const RestException = require("labsmobile-sms/src/Exception/RestException");


const clientLabsMobile = new LabsMobileClient({
    apiKey: process.env.LABSMOBILE_API_KEY
  });




exports.sendReminderSMS = async () => {
    console.log("API Key cargada:", process.env.LABSMOBILE_API_KEY); // Depuración
console.log("Cliente LabsMobile:", clientLabsMobile); // Verifica si es undefined
    console.log("📢 Enviando recordatorio de citas...");
    try {
        const citas = await getCitasDelDiaSiguiente();
        console.log('📋 Citas obtenidas:', citas);

        if (citas.length === 0) {
            console.log('❌ No hay citas para enviar recordatorio.');
            return;
        }

        for (let cita of citas) {  
            console.log(`📩 Enviando recordatorio para: ${cita.NOMBRE} con ${cita.PROFESIONAL}`);
            console.log(cita);

            const fechaFormateada = new Date(cita.FECHA_CITA).toISOString().split('T')[0];
            const mensaje = `Hola ${cita.NOMBRE}, recuerda tu cita de ${cita.SERVICIO} el día ${fechaFormateada} a las ${cita.HORA_CITA}, si necesitas reprogramarla contáctanos al 3007015239.`;

            let telefono = cita.TELEFONO_FIJO.replace(/\D/g, ''); 
            if (!telefono.startsWith('57')) {
                telefono = `57${telefono}`;
            }
            console.log(clientLabsMobile);
            if (telefono.length >= 10) { 
                try {
                    const response = await clientLabsMobile.sendSms({
                        msisdn: telefono,
                        message: mensaje,
                        sender: sender,
                    });
                    console.log(`✅ Recordatorio enviado a: ${cita.TELEFONO_FIJO}`);
                    console.log(response);

                    await db.query('UPDATE citas SET ESTADO = "Recordatorio enviado" WHERE ID = ?', [cita.ID]);
                } catch (error) {
                    console.error(`⚠️ Error al enviar SMS a ${cita.TELEFONO_FIJO}:`, error);
                }
            } else {
                console.log(`⚠️ Número inválido para la cita de ${cita.NOMBRE}`);
            }
        }

        console.log("🚀 Todos los recordatorios han sido procesados.");
    } catch (error) {
        console.error('❌ Error al enviar recordatorios de citas:', error);
    }
};

async function getCitasDelDiaSiguiente() {
    const [rows] = await db.query('SELECT * FROM citas WHERE FECHA_CITA = CURDATE() + INTERVAL 1 DAY AND ESTADO = "pendiente"');
    return rows; 
}


exports.sendManualSMS = async (req, res) => {
    console.log('📩 Datos recibidos:', req.body);
    const { nombre, telefono, mensaje } = req.body;

    if (!nombre || !telefono || !mensaje) {
        return res.status(400).json({ success: false, message: "Nombre, teléfono y mensaje son requeridos" });
    }

    try {
        let numeroFormateado = telefono.replace(/\D/g, ''); // Eliminar caracteres no numéricos
        if (!numeroFormateado.startsWith('57')) {
            numeroFormateado = `57${numeroFormateado}`; // LabsMobile no usa "+"
        }

        if (numeroFormateado.length < 10) {
            return res.status(400).json({ success: false, message: "Número de teléfono inválido" });
        }

        const response = await smsClient.sendSMS({
            msisdn: numeroFormateado,
            message: mensaje,
            sender: sender,
        });

        console.log(`✅ SMS enviado a ${telefono}`, response);
        res.json({ success: true, message: `SMS enviado a ${telefono}` });

    } catch (error) {
        console.error("⚠️ Error al enviar SMS:", error);
        res.status(500).json({ message: "Error interno al procesar la solicitud." });
    }
};


                