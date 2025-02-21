const { client, fromPhoneNumber } = require('../config/twilioConfig');
const db = require("../config/db");

exports.sendReminderSMS = async () => {
    console.log("📢 Enviando recordatorio de citas...");
    try {
        const citas = await getCitasDelDiaSiguiente();
        console.log('📋 Citas obtenidas:', citas);

        if (citas.length === 0) {
            console.log('❌ No hay citas para enviar recordatorio.');
            return; // Sale de la función, pero no detiene el programa
        }

        // Iterar sobre el array de citas
        for (let cita of citas) {  
            console.log(`📩 Enviando recordatorio para: ${cita.NOMBRE} con ${cita.PROFESIONAL}`);
            console.log(cita); // Depuración de datos

            // Formatear la fecha correctamente
            const fechaFormateada = new Date(cita.FECHA_CITA).toISOString().split('T')[0];
            const mensaje = `Hola ${cita.NOMBRE}, recuerda tu cita de ${cita.SERVICIO} el día ${fechaFormateada} a las ${cita.HORA_CITA}.`;

            let telefono = cita.TELEFONO_FIJO.replace(/\D/g, ''); // Eliminar caracteres no numéricos
            if (!telefono.startsWith('57')) {
                telefono = `+57${telefono}`; // Agregar prefijo si no lo tiene
            } else {
                telefono = `+${telefono}`;
            }

            // Enviar el SMS si el teléfono es válido
            if (telefono.length >= 10) { 
                try {
                    await client.messages.create({
                        body: mensaje,
                        from: fromPhoneNumber,
                        to: telefono,
                    });
                    console.log(`✅ Recordatorio enviado a: ${cita.TELEFONO_FIJO}`);

                    // Marcar la cita como enviada en la base de datos
                    await db.query('UPDATE citas SET ESTADO = "Recordatorio enviado" WHERE ID = ?', [cita.ID]);
                } catch (error) {
                    console.error(`⚠️ Error al enviar SMS a ${cita.TELEFONO_FIJO}:`, error);
                }
            } else {
                console.log(`⚠️ Número inválido para la cita de ${cita.NOMBRE}`);
            }
        }

        console.log("🚀 Todos los recordatorios han sido procesados.");
        return; // Finaliza la función sin detener el programa principal
    } catch (error) {
        console.error('❌ Error al enviar recordatorios de citas:', error);
        return; // Finaliza la función sin afectar el programa principal
    }
};

// Asegúrate de que esta función devuelve los datos correctamente
async function getCitasDelDiaSiguiente() {
    const [rows] = await db.query('SELECT * FROM citas WHERE FECHA_CITA = CURDATE() + INTERVAL 1 DAY AND ESTADO = "pendiente"');
    return rows; // Retorna directamente el array de citas
}


