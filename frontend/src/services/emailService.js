const API_URL = "http://localhost:3000/api/correo"; // Base de la API

// 📩 Función para enviar recordatorios por correo
export const sendReminderEmails = async () => {
    try {
        const token = localStorage.getItem("token"); 
        if (!token) throw new Error("No hay token disponible.");

        const response = await fetch(`${API_URL}/enviar-recordatorios`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const text = await response.text();
        console.log("📩 Respuesta en texto:", text);

        const data = JSON.parse(text);
        return { success: true, ...data };

    } catch (error) {
        console.error("Error enviando recordatorios:", error);
        return { success: false, message: "Error en el servidor", error: error.message };
    }
};

// ⏳ Función para obtener el estado del cron
export const getCronStatus = async () => {
    try {
        const token = localStorage.getItem("token"); // Obtener token almacenado
        if (!token) {
            throw new Error("No hay token disponible.");
        }

        const response = await fetch("http://localhost:3000/api/correo/estado-cron", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error obteniendo estado del cron:", error);
        return null;
    }
};



  