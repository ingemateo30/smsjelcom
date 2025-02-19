const express = require("express");
const router = express.Router();
const { upload, procesarExcel } = require("../controllers/citasController");

router.post("/subir-excel", upload.single("file"), procesarExcel);

module.exports = router;
