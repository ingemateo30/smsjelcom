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

    for (const reminder of reminders) {
      const message = `📢 Hola *${reminder.nombre_paciente}*, te recordamos tu cita médica para *mañana* a las *${reminder.fecha}*.`;

      await axios.post(
        `https://api.ultramsg.com/${instanceId}/messages/chat`,
        {
          token: token,
          to: `+57${reminder.telefono}`,
          body: message,
        }
      );
      console.log(`✅ Mensaje enviado a ${reminder.telefono}`);
    }

    res.status(200).json({ message: "Mensajes enviados con éxito." });
  } catch (error) {
    console.error("❌ Error enviando WhatsApp:", error);
    res.status(500).json({ error: "Error al enviar recordatorios." });
  }
};

module.exports = { sendWhatsAppReminder };
