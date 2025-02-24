const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const db = require("../config/db");
const cron = require("node-cron");
const moment = require("moment-timezone");

dotenv.config();

const CRON_HORA_EJECUCION = "08:00";

let estadoCron = {
    ultimaEjecucion: null,
    totalEnviados: 0,
    totalErrores: 0,
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


exports.enviarRecordatoriosDiarios = async (req, res) => {
    try {
        console.log("📩 Iniciando envío de recordatorios...");
        const fechaManana = moment().tz("America/Bogota").add(1, "day").format("YYYY-MM-DD");

        console.log("📅 Buscando citas para la fecha:", fechaManana);

        const [citas] = await db.query(
            `SELECT ID, NOMBRE, EMAIL,PROFESIONAL,SERVICIO, FECHA_CITA as fecha, HORA_CITA as hora 
            FROM citas 
            WHERE FECHA_CITA = ? 
            AND estado != 'recordatorio enviado' 
            AND email IS NOT NULL 
            AND email NOT LIKE '%@temporal.com'`,
            [fechaManana]
        );

        if (citas.length === 0) {
            console.log("✅ No hay citas con correos válidos.");
            estadoCron = { ultimaEjecucion: new Date(), totalEnviados: 0, totalErrores: 0 };
            if (!req.fake) return res.json({ message: "No hay citas pendientes." });
            return;
        }

        let recordatoriosEnviados = [];
        let errores = [];

        for (const cita of citas) {
            try {
                if (!isValidEmail(cita.EMAIL)) {
                    errores.push({ citaId: cita.ID, error: "Formato de correo inválido" });
                    continue;
                }

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: cita.EMAIL,
                    subject: "Recordatorio Cita Médica Hospital Regional de Sangil",
                    html: generarHtmlRecordatorio(cita.NOMBRE, cita.fecha, cita.hora, cita.SERVICIO),
                });

                await db.query("UPDATE citas SET estado = 'recordatorio enviado' WHERE ID = ?", [cita.ID]);
                recordatoriosEnviados.push(cita.ID);
            } catch (error) {
                console.error(`❌ Error en cita ${cita.ID}:`, error);
                errores.push({ citaId: cita.ID, error: error.message });
            }
        }

        console.log("📩 Proceso de envío finalizado.");
        estadoCron = {
            ultimaEjecucion: new Date(),
            totalEnviados: recordatoriosEnviados.length,
            totalErrores: errores.length,
        };

        if (!req.fake) return res.json({ message: "Envío de recordatorios completado.", estadoCron });
    } catch (error) {
        console.error("❌ Error en el proceso de recordatorios:", error);
        if (!req.fake) return res.status(500).json({ message: "Error al enviar recordatorios.", error: error.message });
    }
};


exports.obtenerEstadoCron = (req, res) => {
    const ahora = moment().tz("America/Bogota");
    let proximaEjecucion = ahora.clone().startOf("day").add(8, "hours");

    if (ahora.isAfter(proximaEjecucion)) {
        proximaEjecucion.add(1, "day");
    }

    const tiempoRestante = moment.duration(proximaEjecucion.diff(ahora));
    const tiempoRestanteEnSegundos = tiempoRestante.asSeconds();

    console.log("Tiempo restante en segundos (backend):", tiempoRestanteEnSegundos);

    res.json({
        ultimaEjecucion: estadoCron.ultimaEjecucion ? estadoCron.ultimaEjecucion.toISOString() : "Aún no ejecutado",
        proximaEjecucion: proximaEjecucion.toISOString(),
        tiempoRestante: `${tiempoRestante.hours()}h ${tiempoRestante.minutes()}m ${tiempoRestante.seconds()}s`,
        tiempoRestanteEnSegundos: Math.max(0, tiempoRestanteEnSegundos),
        totalEnviados: estadoCron.totalEnviados,
        totalErrores: estadoCron.totalErrores,
    });
};


cron.schedule(
    "0 8 * * *",
    async () => {
        console.log("⏳ Ejecutando el envío automático de correos...");
        await exports.enviarRecordatoriosDiarios({ body: {} }, { json: () => {} });
    },
    {
        timezone: "America/Bogota",
    }
);


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function generarHtmlRecordatorio(nombre, fecha, hora, profesional) {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>📅 Recordatorio de Cita Médica</h2>
            <p>Hola ${nombre},</p>
            <p>Te recordamos que tienes una cita ${profesional} programada:</p>
            <ul>
                <li><strong>Fecha:</strong> ${moment(fecha).format("dddd, D [de] MMMM [de] YYYY")}</li>
                <li><strong>Hora:</strong> ${hora}</li>
            </ul>
            <p>Por favor, llega 15 minutos antes de tu cita.</p>
            <p>Si necesitas reprogramarla, contáctanos al siguiente numero # .</p>
            
        </div>
    `;
}

exports.sendManualEmail = async (req, res) => {
    console.log('Datos recibidos:', req.body);
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ success: false, message: "Nombre, correo y contenido son requeridos" });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo,
            subject: "Recordatorio cita medica",
            html: `
                <h2>Hola, ${nombre}</h2>
                <p>${mensaje}</p>
                <br>
                <strong>Gracias por confiar en nosotros.</strong>
            `
        };
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: `Correo enviado a ${correo}` });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ message: "Error interno al procesar la solicitud." });
    }
};

