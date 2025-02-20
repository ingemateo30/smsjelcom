const express = require("express");
const router = express.Router();
const { enviarRecordatorioCita } = require("../controllers/correoController");

router.post("/enviar-recordatorio", enviarRecordatorioCita);

module.exports = router;
