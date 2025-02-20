const express = require("express");
const router = express.Router();
const { enviarRecordatoriosDiarios, obtenerEstadoCron } = require("../controllers/correoController");
const { verificarRol } = require("../middlewares/auth");

// 🔹 Ruta protegida para ejecutar el cron manualmente
router.get("/enviar-recordatorios", verificarRol(["admin", "usuario"]), enviarRecordatoriosDiarios);

// 🔹 Ruta para obtener el estado del cron
router.get("/estado-cron", verificarRol(["admin", "usuario"]), obtenerEstadoCron);

module.exports = router;

