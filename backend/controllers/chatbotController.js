const db = require("../config/db");
require('dotenv').config();
const axios = require("axios");



exports.handleWhatsAppResponse = async (req, res) => {
    try {
        const { data } = req.body;
        // Extraer información relevante del mensaje recibido
        const { body, from, to, fromMe, timestamp,id } = data;

        console.log(data);

        if (!data || !data.from || !data.body) {
            console.error("⚠️ Error: Datos faltantes en la respuesta de UltraMsg", req.body);
            return res.status(400).json({ error: "Datos incompletos en la solicitud" });
        }
        
        // Almacenar el mensaje en la base de datos, independientemente de si es entrante o saliente
        await saveMessage({
            id,
            phone:from.replace("57", "").replace("@c.us", ""),
            body,
            fromMe,
            timestamp: timestamp || new Date().toISOString(),
            status: 'pendiente'
        });

        if (fromMe === false) {
            return res.status(200).json({ message: "Mensaje almacenado (saliente)." });
        }
        
        const phone = from.replace("57", "").replace("@c.us", "");
        
        // Buscar si existe un recordatorio enviado para este número
        const reminder = await getMessagesByPhone(phone);
        
        if (!reminder) {
            console.log(`❌ No se encontró recordatorio activo para el número ${phone}`);
            return res.status(200).json({ message: "Mensaje almacenado, sin recordatorio activo." });
        }
 
        const response = body.trim().toLowerCase();
        const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
        const token = process.env.ULTRAMSG_TOKEN;
        let replyMessage = '';
        let newStatus = '';
        
        if (response === 'sí' || response === 'si') {
            replyMessage = `Gracias por confirmar tu cita médica para el ${remi, nder.fecha} a las ${reminder.hora}. Te esperamos puntualmente.`;
            newStatus = "confirmada";
        } 
        else if (response === 'no') {
            replyMessage = `Hemos registrado la cancelación de tu cita médica para el ${reminder.fecha} a las ${reminder.hora}. Si deseas reagendarla, por favor comunícate con nosotros.`;
            newStatus = "cancelada";
        } 
        else if (response === 'reagendar') {
            replyMessage = `Hemos recibido tu solicitud para reagendar la cita del ${reminder.fecha} a las ${reminder.hora}. En breve un asesor se comunicará contigo para coordinar una nueva fecha.`;
            newStatus = "reagendamiento solicitado";
            
            const staffNotification = `📣 SOLICITUD DE REAGENDAMIENTO\n\n👤 Paciente: ${reminder.nombre_paciente}\n📞 Teléfono: ${phone}\n📅 Cita Original: ${reminder.fecha} - ${reminder.hora}\n🏥 Servicio: ${reminder.servicio}`;
            
            // Aquí puedes enviar esta notificación a los números del personal
            const staffPhone = process.env.STAFF_PHONE_NUMBER;
            
            if (staffPhone) {
                try {
                    const response = await axios.post(
                        `https://api.ultramsg.com/${instanceId}/messages/chat`,
                        {
                            token: token,
                            to: staffPhone,
                            body: staffNotification,
                        }
                    );  
                    console.log(`✅ Notificación de reagendamiento enviada al personal`);
                } catch (error) {
                    console.error(`❌ Error enviando notificación al personal:`, error);
                }
            }
        } 
        else {
            replyMessage = `No hemos podido procesar tu respuesta. Por favor, responde con una de las siguientes opciones:\n✅ "Sí" - Confirmar cita\n❌ "No" - Cancelar cita\n🔄 "Reagendar" - Solicitar cambio de fecha`;
            newStatus = reminder.status;
        }

        if (newStatus !== reminder.status) {
            try {
                const response = await axios.post(
                    `https://api.ultramsg.com/${instanceId}/messages/chat`,
                    {
                        token: token,
                        to: from,
                        body: replyMessage,
                    }
                ); 
                // Marcar que ya se procesó esta respuesta para evitar procesarla nuevamente
                await updateReminderStatus(phone, newStatus);
                
                // También registrar la respuesta en el historial de la cita
        
                
                console.log(`✅ Respuesta enviada a ${phone} y estado actualizado a ${newStatus}`);
            } catch (error) {
                console.error(`❌ Error enviando respuesta a ${phone}:`, error);
            }
        } else if (response !== 'sí' && response !== 'si' && response !== 'no' && response !== 'reagendar') {
            // Solo enviar mensaje de ayuda si la respuesta no fue reconocida
            try {
                const response = await axios.post(
                    `https://api.ultramsg.com/${instanceId}/messages/chat`,
                    {
                        token: token,
                        to: from,
                        body: replyMessage,
                    }
                );  
                console.log(`✅ Mensaje de ayuda enviado a ${phone}`);
            } catch (error) {
                console.error(`❌ Error enviando mensaje de ayuda a ${phone}:`, error);
            }
        }
        
        res.status(200).json({ message: "Mensaje procesado y almacenado correctamente." });
    } catch (error) {
        console.error("❌ Error procesando respuesta:", error);
        res.status(500).json({ error: "Error al procesar la respuesta." });
    }
};


async function saveMessage (messageData){
        try {
            const result = await db.execute(
                `INSERT INTO mensajes (id, numero, mensaje, fecha, tipo, estado) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    messageData.id,
                    messageData.phone,
                    messageData.body,
                    messageData.timestamp || new Date(),
                    messageData.fromMe ? "saliente" : "entrante",
                    messageData.status || "pendiente"
                ]
            );
    
            console.log(`📝 Mensaje almacenado en BD: ${messageData.fromMe ? "Saliente" : "Entrante"} - ${messageData.phone}`);
            return result;
        } catch (error) {
            console.error("Error guardando mensaje en la base de datos:", error);
            throw error;
        }
    };
    
    // Obtener mensajes por número de teléfono
    async function getMessagesByPhone(phone){
        try {
            const [rows] = await db.execute(
                `SELECT * FROM citas WHERE TELEFONO_FIJO = ? ORDER BY FECHA_CITA DESC LIMIT 1`,
                [phone]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error al obtener los mensajes por teléfono:", error);
            throw error;
        }
    };

    async function updateReminderStatus(phone, newStatus){
        try {
            const result = await db.execute(
                `UPDATE mensajes 
                 SET estado = ? 
                 WHERE numero = ?`,
                [newStatus, phone]
            );
    
            console.log(`✅ Estado actualizado para el número ${phone}: ${newStatus}`);
            return result;
        } catch (error) {
            console.error("Error actualizando estado del mensaje:", error);
            throw error;
        }
    }
