const cron = require("node-cron");
const pool = require("../config/db");
const sendEmail = require("../config/enviocorreo");
const smsController = require("../controllers/sms2controller");
const moment = require("moment"); 
moment.locale("es");

cron.schedule("0 8 * * *", async () => {
    console.log("⏳ Ejecutando tarea de recordatorio de citas...");

    try {
        const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
        const [rows] = await pool.query(
            "SELECT NOMBRE, FECHA_CITA, HORA_CITA, SERVICIO, PROFESIONAL, TELEFONO_FIJO FROM citas WHERE FECHA_CITA = ?",
            [tomorrow]
        );

        if (rows.length === 0) {
            console.log("✅ No hay citas para enviar recordatorios.");
            return;
        }

        console.log(`📩 Enviando ${rows.length} recordatorios de citas...`);

        for (let cita of rows) {
            const { NOMBRE, FECHA_CITA, HORA_CITA, SERVICIO, PROFESIONAL, TELEFONO_FIJO } = cita;
            
            const emailOptions = {
                to: "paciente@example.com",
                subject: "Recordatorio de Cita Médica",
                text: `Hola ${NOMBRE}, este es un recordatorio de tu cita médica.\n\n📅 Fecha: ${FECHA_CITA}\n⏰ Hora: ${HORA_CITA}\n🏥 Servicio: ${SERVICIO}\n👨‍⚕️ Profesional: ${PROFESIONAL}\n📞Por favor, llega con 10 minutos de anticipación.`,
            };

            await sendEmail(emailOptions);
            console.log(`✅ Recordatorio enviado a ${NOMBRE}`);
        }

    } catch (error) {
        console.error("❌ Error al enviar los recordatorios:", error);
    }
});

cron.schedule("0 8 * * *", async () => {
    console.log("Ejecutando envío de recordatorios...");
  
    const citasHoy = await db.query("SELECT * FROM citas WHERE fecha = CURDATE()");
  
    for (let cita of citasHoy) {
      const mensaje = `Hola ${cita.nombre}, recuerde su cita el ${cita.fecha} a las ${cita.hora}.`;
      await smsController.enviarSMS({ body: { telefono: cita.telefono, mensaje } }, { json: () => {} });
    }
  
    console.log("Recordatorios enviados.");
  });
