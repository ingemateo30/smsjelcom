const express = require("express");
const {
  sendWhatsAppReminder,
  processWhatsAppReply,
  verifyWebhook,
  handleMetaWebhook
} = require("../controllers/whatsappController");

const router = express.Router();

// Envío de recordatorios
router.get("/enviar-recordatorios", sendWhatsAppReminder);

// Webhook de Meta WhatsApp Business API
router.get("/webhook", verifyWebhook);        // Verificación de webhook
router.post("/webhook", handleMetaWebhook);   // Recibir mensajes entrantes

// Procesar respuestas (legacy - para compatibilidad)
router.get("/respuestas", processWhatsAppReply);

module.exports = router;
