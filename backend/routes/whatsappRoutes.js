const express = require("express");
const { sendWhatsAppReminder } = require("../controllers/whatsappController");

const router = express.Router();

// Ruta para enviar recordatorios de WhatsApp
router.get("/enviar-recordatorios", sendWhatsAppReminder);

module.exports = router;
