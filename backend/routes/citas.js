const express = require("express");
const router = express.Router();
const { upload, procesarExcel } = require("../controllers/citasController");
const { verificarRol } = require("../middlewares/auth");

// Middleware para validar tipo de archivo
const validarArchivo = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ningún archivo" });
    }
    
    const fileExt = req.file.originalname.split('.').pop();
    if (!['xlsx', 'xls'].includes(fileExt)) {
        return res.status(400).json({ message: "Formato de archivo no permitido. Solo se aceptan archivos .xlsx o .xls" });
    }
    
    next();
};

// Ruta protegida para subir y procesar el archivo Excel
router.post("/subir-excel", verificarRol(["admin", "usuario"]), upload.single("file"), validarArchivo, procesarExcel);

module.exports = router;

