const express = require('express');
const router = express.Router();
const {
    register,
    login,
    listarUsuarios,
    solicitarRecuperacion,
    resetearPassword,
    actualizarEstado
} = require('../controllers/authController');
const { verificarRol } = require('../middlewares/auth'); // Middleware para control de roles

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', solicitarRecuperacion);
router.post('/reset-password', resetearPassword);

// Rutas protegidas (requieren autenticación y permisos)
router.get('/usuarios', verificarRol(['admin']), listarUsuarios);
router.put('/usuarios/:id/estado', verificarRol(['admin']), actualizarEstado);

module.exports = router;

