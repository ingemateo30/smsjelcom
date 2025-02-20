const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { listarUsuarios } = require('../controllers/authController');
const { solicitarRecuperacion, resetearPassword } = require('../controllers/authController'); 
const {actualizarEstado} = require("../controllers/authController");

router.post('/register', register);
router.post('/login', login);
router.get('/usuarios', listarUsuarios);
router.post('/forgot-password', solicitarRecuperacion);
router.post('/reset-password', resetearPassword);
router.put("/usuarios/:id/estado", actualizarEstado);

module.exports = router;
