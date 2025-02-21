const API_URL = "http://localhost:3000/api/correo";

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

        const contentType = response.headers.get("content-type");

        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { message: text };
        }
        console.log("📩 Respuesta del servidor:", data);
        return { success: true, ...data };
    } catch (error) {
        console.error("❌ Error enviando recordatorios:", error);
        return { success: false, message: "Error en el servidor", error: error.message };
    }
};


export const getCronStatus = async () => {
    try {
        const token = localStorage.getItem("token");
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



