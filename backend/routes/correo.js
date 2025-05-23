const express = require("express");
const router = express.Router();
const { enviarRecordatoriosDiarios, obtenerEstadoCron, sendManualEmail } = require("../controllers/correoController");
const { verificarRol } = require("../middlewares/auth");
const { sendReminderSMS} = require('../controllers/smsController');


router.get("/enviar-recordatorios", verificarRol(["admin", "usuario"]), enviarRecordatoriosDiarios);

router.get("/estado-cron", verificarRol(["admin", "usuario"]), obtenerEstadoCron);

router.post("/enviar-manual", verificarRol(["admin", "usuario"]), sendManualEmail);

router.post('/enviar-recordatorio-sms', async (req, res) => {
    try {
        console.log("📢 Recibida petición para enviar recordatorios SMS...");
        
        const resultado = await sendReminderSMS();

        return res.json(resultado);
    } catch (error) {
        console.error("❌ Error en el endpoint /enviar-recordatorio-sms:", error);
        return res.status(500).json({ success: false, message: "Error al enviar recordatorios", error: error.message });
    }
});

module.exports = router;


