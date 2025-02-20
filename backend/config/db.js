const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Límite de conexiones simultáneas
  queueLimit: 0
}).promise();

// Manejo de errores para evitar caída de la app
db.getConnection()
  .then(connection => {
    console.log('✅ Conectado a MySQL');
    connection.release(); // Liberar conexión del pool
  })
  .catch(err => {
    console.error('❌ Error al conectar a MySQL:', err.message);
    process.exit(1); // Detiene la aplicación si hay un error grave
  });

module.exports = db;
