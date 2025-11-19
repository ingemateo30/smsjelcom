const bcrypt = require("bcryptjs");

function generarPassword(passwordPlano) {
    if (!passwordPlano) {
        console.log("❌ Debes escribir una contraseña en texto plano.");
        console.log("   Ejemplo: node generarPassword.js MiClave123");
        process.exit(1);
    }

    const salt = bcrypt.genSaltSync(12); // Igual a tu backend
    const hash = bcrypt.hashSync(passwordPlano, salt);

    console.log("==========================================");
    console.log("🔐 Contraseña original:");
    console.log("   " + passwordPlano);

    console.log("\n🔑 Hash generado (para DB):");
    console.log("   " + hash);

    console.log("\n➡️ Copia este hash en el campo password de la tabla usuarios.");
    console.log("==========================================");
}

const passwordPlano = process.argv[2];
generarPassword(passwordPlano);
