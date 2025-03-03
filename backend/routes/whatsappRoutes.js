const express = require("express");
const { sendWhatsAppReminder, processWhatsAppReply}  = require("../controllers/whatsappController");
const {handleWhatsAppResponse }  = require("../controllers/chatbotController");

const router = express.Router();

// Ruta para enviar recordatorios de WhatsApp
router.get("/enviar-recordatorios", sendWhatsAppReminder);

router.post("/webhook-ultramsg", handleWhatsAppResponse);


module.exports = router;
