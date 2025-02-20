import nodemailer from "nodemailer";
import Cita from "../models/cita.js";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();

// Configuración del servicio de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarRecordatoriosDiarios = async (req, res) => {
  try {
    // Obtener la fecha del día siguiente
    const fechaManana = new Date();
    fechaManana.setDate(fechaManana.getDate() + 1);
    const fechaFormato = fechaManana.toISOString().split("T")[0];

    // Buscar todas las citas para mañana
    const citas = await Cita.findAll({
      where: {
        fecha: fechaFormato,
        estado: { [Op.ne]: "recordatorio enviado" }, // Solo enviar si no se ha enviado antes
      },
    });

    if (citas.length === 0) {
      return res.json({ message: "No hay citas para enviar recordatorios." });
    }

    // Enviar correos de recordatorio
    for (const cita of citas) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: cita.email,
        subject: "Recordatorio de Cita Médica",
        text: `Hola ${cita.nombre}, este es un recordatorio de tu cita médica programada para el día ${cita.fecha} a las ${cita.hora}.`,
      };

      await transporter.sendMail(mailOptions);

      // Opcional: Actualizar el estado de la cita
      await Cita.update({ estado: "recordatorio enviado" }, { where: { id: cita.id } });
    }

    res.json({ message: "Recordatorios enviados correctamente" });
  } catch (error) {
    console.error("Error al enviar recordatorios:", error);
    res.status(500).json({ message: "Error al enviar recordatorios" });
  }
};
