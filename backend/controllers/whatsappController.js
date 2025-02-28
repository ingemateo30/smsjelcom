require("dotenv").config();
const axios = require("axios");
const WhatsAppReminder = require("../models/WhatsAppReminder");

const sendWhatsAppReminder = async (req, res) => {
    try {
        const reminders = await WhatsAppReminder.getRemindersForTomorrow();

        if (reminders.length === 0) {
            return res.status(200).json({ message: "No hay citas para mañana." });
        }

        const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
        const token = process.env.ULTRAMSG_TOKEN;

        for (let i = 0; i < reminders.length; i++) { 
            const reminder = reminders[i];

            const message = `*📢 Recordatorio de Cita Médica* \n\n👤 *Paciente:* ${reminder.nombre_paciente}\n📅 *Fecha:* ${reminder.fecha}\n🕘 *Hora:* ${reminder.hora}\n🏥 *Servicio:* ${reminder.servicio}\n\nTe esperamos puntualmente. Si deseas *reagendar* tu cita, por favor contáctanos al 📞 #.`; 
            
            try {
                await axios.post(
                    `https://api.ultramsg.com/${instanceId}/messages/chat`,
                    {
                        token: token,
                        to: `+57${reminder.telefono}`,
                        body: message,
                    }
                );
                console.log(`✅ Mensaje enviado a ${reminder.telefono}`);
                await WhatsAppReminder.updateReminderStatus(reminder.id, "recordatorio enviado");
            } catch (error) {
                console.error(`❌ Error enviando mensaje a ${reminder.telefono}:`, error);
            }
            if (i < reminders.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        res.status(200).json({ message: "Mensajes enviados con éxito." });
    } catch (error) {
        console.error("❌ Error en el envío de recordatorios:", error);
        res.status(500).json({ error: "Error al enviar recordatorios." });
    }
};
module.exports = { sendWhatsAppReminder };



