require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db");

// Importar rutas
const authRoutes = require("./routes/auth");
const citasRoutes = require("./routes/citas");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Permitir solo el frontend autorizado
app.use(express.json());
app.use(morgan("dev")); // Log de solicitudes

// Verificar conexión a la base de datos
db.getConnection((err, connection) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err);
    } else {
        console.log("Conectado a la base de datos MySQL");
        connection.release();
    }
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/citas", citasRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Error interno del servidor" });
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
