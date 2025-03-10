const rateLimit = require("express-rate-limit");

// 🔐 Configurar límite de intentos para el login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ⏳ 15 minutos
    max: 5, // 🚫 Máximo 5 intentos por IP en 15 min
    message: {
        message: "Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true, 
    legacyHeaders: false,
});

module.exports = { loginLimiter };
