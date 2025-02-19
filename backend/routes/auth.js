const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { solicitarRecuperacion, resetearPassword } = require('../controllers/authController'); // 👈 Verifica esta línea

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', solicitarRecuperacion);
router.post('/reset-password', resetearPassword);

module.exports = router;
