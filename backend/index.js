require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/auth');
const citasRoutes = require("./routes/citas");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use("/api/citas", citasRoutes);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
