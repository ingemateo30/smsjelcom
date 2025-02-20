const sendReminderEmails = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/correo/enviar-recordatorio", {
        method: "POST",
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error enviando recordatorios:", error);
      return { success: false, message: "Error en el servidor" };
    }
  };
  
  export { sendReminderEmails };
  