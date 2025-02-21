import axios from "axios";

const API_URL = "http://localhost:3000/api/correo"; // Ajusta la URL según tu backend

// Enviar recordatorios de SMS manualmente
export const sendReminderSMS = async () => {
    try {
        const response = await axios.post(`${API_URL}/enviar-recordatorio-sms`);
        return response.data;
    } catch (error) {
        console.error("Error al enviar SMS:", error);
        throw error.response ? error.response.data : { message: "Error desconocido" };
    }
};

