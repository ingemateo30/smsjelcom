const express = require("express");
const router = express.Router();
const { sendManualSMS, sendReminderSMS, getSaldoLabsMobile } = require("../controllers/sms2controller"); // ✅ Importar correctamente

router.post("/enviar-sms", sendManualSMS);
router.post("/enviar", async (req, res) => {
    try {
        console.log("📢 Recibida petición para enviar recordatorios SMS...");
        
        const resultado = await sendReminderSMS();

        return res.json({ success: true, resultado });
    } catch (error) {
        console.error("❌ Error en el endpoint /enviar:", error);
        return res.status(500).json({ success: false, message: "Error al enviar recordatorios", error: error.message });
    }
});
router.get("/saldo", getSaldoLabsMobile);

module.exports = router;

