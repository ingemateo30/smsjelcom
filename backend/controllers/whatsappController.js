require("dotenv").config();
const axios = require("axios");
const WhatsAppReminder = require("../models/WhatsAppReminder");
const Cita = require("../models/Cancelacion");
const getRawBody = require("raw-body");
const db = require("../config/db");

const usuariosEnEsperaDeMotivo = new Map(); // Almacena los números que deben responder un motivo

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

            const message = `*📢 Recordatorio de Cita Médica* \n\n👤 *Paciente:* ${reminder.nombre_paciente}\n📅 *Fecha:* ${reminder.fecha}\n🕘 *Hora:* ${reminder.hora}\n🏥 *Servicio:* ${reminder.servicio}\n\nTe esperamos puntualmente.\n\nPor favor responde:\n✅ *Sí* - Confirmar cita\n❌ *No* - Cancelar cita\n🔄 *Reagendar* - Solicitar cambio de fecha`;

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

const processWhatsAppReply = async (req, res) => {
    try {
        // Consultar los mensajes desde la base de datos
        const [rows] = await db.query("SELECT id, numero, mensaje, fecha, tipo FROM mensajes");
    
        // Si no hay mensajes en la base de datos
        if (rows.length === 0) {
          return res.status(404).json({ message: "No hay mensajes en la base de datos." });
        }
    
        // Transformamos los datos de la base de datos en un formato más amigable para el frontend
        const responses = rows.map(row => ({
          id: row.id,
          telefono: row.numero,
          nombre_paciente: row.numero,  // Asegúrate de incluir un campo de nombre si lo tienes en la base de datos
          fecha_cita: row.fecha,        // Si tienes una columna para fecha de cita, cámbiala si es necesario
          respuesta: row.mensaje,       // Aquí asumimos que el mensaje será la respuesta
          motivo: row.tipo              // Asumimos que el tipo es el motivo
        }));
    
        console.log("Respuestas enviadas al frontend:", responses);  // Verifica las respuestas que se envían
        return res.json(responses);
      } catch (error) {
        console.error("Error al obtener los mensajes:", error);
        return res.status(500).json({ error: "Error al obtener los mensajes." });
      }
};
/*
const processWhatsApp = async (req, res) => {
    const { id, from, body, time, type } = req.body.data;
  
    // Convertir la marca de tiempo Unix a una fecha legible
    const fecha = new Date(time * 1000);
  
    // Consultamos la base de datos para insertar el mensaje
    const query = `
      INSERT INTO mensajes (id, numero, mensaje, fecha, tipo)
      VALUES (?, ?, ?, ?, ?);
    `;
    
    const values = [id, from.split('@')[0], body, fecha, type];
    /*
    try {
      await db.query(query, values);
      console.log("Mensaje guardado correctamente.");
  
      
      if (body.toLowerCase() === "si") {
        await sendMessage(from, "¡Gracias por confirmar! Procesaremos tu solicitud.");
      } else if (body.toLowerCase() === "no") {
        // Si la respuesta es "no", enviar una pregunta de motivo
        await sendMessage(from, "¿escribe el motivo de la cancelacion?");
      } else {
        // Si es cualquier otra cosa, informar que se contactarán pronto
        await sendMessage(from, "Gracias por tu mensaje. Nos pondremos en contacto pronto para ayudarte.");
      }
  
      return res.status(200).json({ message: "Mensaje guardado correctamente." });
    } catch (error) {
      console.error("Error al guardar los datos en la base de datos:", error);
      return res.status(500).json({ error: "Error al guardar los datos." });
    }
  };
*/
  const sendMessage = async (to, message) => {
    try {
    const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
    const token = process.env.ULTRAMSG_TOKEN;
      const response = await axios.post(
        `https://api.ultramsg.com/${instanceId}/messages/chat`,
        {
            token: token,
            to: `+${to}`,
            body: message,
        });
      console.log("Mensaje enviado:", response.data);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }};
  


module.exports = { sendWhatsAppReminder, processWhatsAppReply/*processWhatsApp*/ };




