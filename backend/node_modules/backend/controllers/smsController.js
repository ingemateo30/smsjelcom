const { client, fromPhoneNumber } = require('../config/twilioConfig');
const db = require("../config/db");


exports.sendReminderSMS = async () => {
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
            const mensaje = `Hola ${cita.NOMBRE}, recuerda tu cita de ${cita.SERVICIO} el día ${fechaFormateada} a las ${cita.HORA_CITA}.`;

            let telefono = cita.TELEFONO_FIJO.replace(/\D/g, '');
            if (!telefono.startsWith('57')) {
                telefono = `+57${telefono}`;
            } else {
                telefono = `+${telefono}`;
            }

            if (telefono.length >= 10) { 
                try {
                    await client.messages.create({
                        body: mensaje,
                        from: fromPhoneNumber,
                        to: telefono,
                    });
                    console.log(`✅ Recordatorio enviado a: ${cita.TELEFONO_FIJO}`);

                    await db.query('UPDATE citas SET ESTADO = "Recordatorio enviado" WHERE ID = ?', [cita.ID]);
                } catch (error) {
                    console.error(`⚠️ Error al enviar SMS a ${cita.TELEFONO_FIJO}:`, error);
                }
            } else {
                console.log(`⚠️ Número inválido para la cita de ${cita.NOMBRE}`);
            }
        }

        console.log("🚀 Todos los recordatorios han sido procesados.");
        return; 
    } catch (error) {
        console.error('❌ Error al enviar recordatorios de citas:', error);
        return; 
    }
};


async function getCitasDelDiaSiguiente() {
    const [rows] = await db.query('SELECT * FROM citas WHERE FECHA_CITA = CURDATE() + INTERVAL 1 DAY AND ESTADO = "pendiente"');
    return rows; 
}


