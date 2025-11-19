require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const WhatsAppReminder = require("../models/WhatsAppReminder");
const db = require("../config/db");

const META_TOKEN = process.env.META_TOKEN;
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
const META_WA_BASE_URL = process.env.META_WA_BASE_URL || "https://graph.facebook.com/v21.0";

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mapeo completo de direcciones por especialidad
 * Basado en el campo SERVICIO de la base de datos
 */
function obtenerDireccionPorEspecialidad(servicio) {
  const servicioUpper = servicio.toUpperCase().trim();

  // ============================================
  // CALLE 16 NO 9-76 (Procedimientos de Cardiología)
  // ============================================
  const serviciosCalle16 = [
    "CARDIOLOGIA PROCEDIMIENTOS",
    "CARDIOLOGIA PEDIATRICA PROCEDIMIENTOS"
  ];

  if (serviciosCalle16.some(esp => servicioUpper.includes(esp))) {
    return {
      direccion1: "Calle 16 No. 9-76",
      direccion2: "Procedimientos de Cardiología",
      extra: ""
    };
  }

  // ============================================
  // EDIFICIO PSI LOCAL 2 CRA 14A NO 29-27 (Endodoncia)
  // ============================================
  const serviciosEdificioPSI = [
    "ENDODONCIA PROCEDIMIENTOS",
    "ENDODONCIA"
  ];

  if (serviciosEdificioPSI.some(esp => servicioUpper.includes(esp))) {
    return {
      direccion1: "Cra 14A # 29A-27 Edificio PSI Local 2",
      direccion2: "Consulta Especializada de Endodoncia",
    extra: "⚠️ IMPORTANTE: Diríjase primero al CES (Avenida Santander 24A-48) antes de ir a esta dirección."

    };
  }

  // ============================================
  // CALLE 9 NO 9-41 (Periodoncia)
  // ============================================
  if (servicioUpper.includes("PERIODONCIA")) {
    return {
      direccion1: "Calle 9 No. 9-41",
      direccion2: "Consulta Especializada de Periodoncia",
    extra: "⚠️ IMPORTANTE: Diríjase primero al CES (Avenida Santander 24A-48) antes de ir a esta dirección."

    };
  }

  // ============================================
  // CES - Avenida Santander 24A-48 (Consulta Externa)
  // ============================================
  const serviciosCES = [
    "ADULTEZ",
    "RIESGO CARDIOVASCULAR",
    "AGUDEZA VISUAL",
    "CIRUGIA GENERAL",
    "CIRUGIA PEDIATRICA",
    "CIRUGIA MAXILOFACIAL",
    "CITOLOGIA",
    "CONTROL PRENATAL",
    "DERMATOLOGIA PROCEDIMIENTOS",
    "DERMATOLOGIA",
    "EDUCACION INDIVIDUAL",
    "EXAMEN DE SENO",
    "GINECOLOGIA",
    "MEDICINA FAMILIAR",
    "MEDICINA GENERAL",
    "MEDICINA INTERNA",
    "NEUROLOGIA",
    "NEUROCIRUGIA",
    "NUTRICION",
    "OBSTETRICIA",
    "ODONTOLOGIA",
    "OPTOMETRIA",
    "OFTALMOLOGIA",
    "NEUROLOGIA PROCEDIMIENTOS",
    "PEDIATRIA",
    "PLANIFICACION FAMILIAR",
    "POS PARTO",
    "ORTOPEDIA Y/O TRAUMATOLOGIA",
    "PRIMERA INFANCIA",
    "PSICOLOGIA",
    "PSIQUIATRIA",
    "SALUD ORAL",
    "VEJEZ",
    "UROLOGIA",
    "TERAPIA FISICA Y RESPIRATORIA",
    "JOVEN",
    "HIGIENE ORAL",
    "ORTOPEDIA"
  ];

  if (serviciosCES.some(esp => servicioUpper.includes(esp))) {
    return {
      direccion1: "Avenida Santander 24A-48",
      direccion2: "Consulta Externa CES Hospital Regional de San Gil",
      extra: ""
    };
  }

  // ============================================
  // HOSPITAL - Carrera 5 # 9-102 (Sede Principal)
  // ============================================
  const serviciosHospital = [
    "ANESTESIOLOGIA",
    "CARDIOLOGIA",
    "ECOGRAFIAS",
    "COLONOSCOPIA",
    "CARDIOLOGIA PEDIATRICA",
    "NEUMOLOGIA PROCEDIMIENTOS",
    "FONOAUDIOLOGIA PROCEDIMIENTOS",
    "GASTROENTEROLOGIA",
    "ENDOSCOPIAS",
    "NEUMOLOGIA",
    "TRAUMATOLOGIA",
    "TRABAJO SOCIAL",
        "OTORRINOLARINGOLOGIA",
    "QX OTORRINO",
    "QX GINECOLOGIA",
    "QX ORTOPEDIA",
    "QX UROLOGIA",
    "QX GENERAL",
    "QX PEDIATRICA",
    "QX NEUROCIRUGIA",
    "QX OFTALMOLOGIA",
    "QX DERMATOLOGICA"
  ];

  if (serviciosHospital.some(esp => servicioUpper.includes(esp))) {
    return {
      direccion1: "Carrera 5 # 9-102",
      direccion2: "Hospital Regional de San Gil - Sede Principal",
      extra: ""
    };
  }

  // ============================================
  // DEFAULT - Servicio no mapeado
  // ============================================
  console.log('⚠️  Servicio no mapeado: "' + servicio + '"');
  return {
    direccion1: "Consulta tu lugar de cita",
    direccion2: "llamanos al 6077249701",
    extra: ""
  };
}

/**
 * Enviar mensaje interactivo con botón de cancelar cita
 * Alternativa a la plantilla, se envía después del recordatorio
 */
async function enviarMensajeConBotonCancelar(numero, citaId, nombrePaciente) {
  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: numero,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: `Hola ${nombrePaciente}, ¿necesitas cancelar tu cita?\n\nSi no puedes asistir, presiona el botón de abajo para cancelarla.`
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "cancel_appointment",
                title: "Cancelar Cita"
              }
            },
            {
              type: "reply",
              reply: {
                id: "keep_appointment",
                title: "Mantener Cita"
              }
            }
          ]
        }
      }
    };

    const response = await axios.post(
      META_WA_BASE_URL + '/' + META_PHONE_NUMBER_ID + '/messages',
      payload,
      {
        headers: {
          Authorization: 'Bearer ' + META_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log('   ✅ Mensaje con botón de cancelar enviado');
    return { success: true, response: response.data };

  } catch (error) {
    console.error('❌ Error enviando mensaje con botón:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Función para enviar plantilla de WhatsApp vía Meta API
 */
async function enviarPlantillaMeta(numero, reminder) {
  try {
    const campos = {
      nombre_paciente: reminder.nombre_paciente || "Paciente",
      fecha: reminder.fecha || "Fecha no disponible",
      hora: reminder.hora || "Hora no disponible",
      servicio: reminder.servicio || "Servicio no especificado",
      profesional: reminder.profesional || "Profesional no asignado",
      direccion1: reminder.direccion1 || "Dirección no disponible",
      direccion2: reminder.direccion2 || "",
      extra: reminder.extra || ""
    };

    // 🔥 SIEMPRE ENVIAR TODOS LOS 8 PARÁMETROS
    // Meta requiere que se envíen TODOS los parámetros definidos en la plantilla
    const bodyParameters = [
      { type: "text", text: campos.nombre_paciente },
      { type: "text", text: campos.fecha },
      { type: "text", text: campos.hora },
      { type: "text", text: campos.servicio },
      { type: "text", text: campos.profesional },
      { type: "text", text: campos.direccion1 },
      { type: "text", text: campos.direccion2 },
      { type: "text", text: campos.extra || " " }, // Siempre incluir
    ];

    const payload = {
      messaging_product: "whatsapp",
      to: numero,
      type: "template",
      template: {
        name: "recordatorio_citas",
        language: { code: "es" },
        components: [
          {
            type: "header",
            parameters: [
              { 
                type: "image", 
                image: { 
                  link: "https://drive.google.com/uc?export=view&id=1wHMGC9zodGNy6C49k2fIj8zDcHQlu5LT",  
                } 
              }
            ],
          },
          {
            type: "body",
            parameters: bodyParameters,
          },
        ],
      },
    };

    const response = await axios.post(
      META_WA_BASE_URL + '/' + META_PHONE_NUMBER_ID + '/messages',
      payload,
      {
        headers: {
          Authorization: 'Bearer ' + META_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return { success: true, response: response.data };

  } catch (error) {
    console.error('❌ ERROR META API:');
    console.error('   Status:', error.response ? error.response.status : 'N/A');
    console.error('   Error:', JSON.stringify(error.response ? error.response.data : {}, null, 2));
    
    const errorMsg = (error.response && error.response.data && error.response.data.error && error.response.data.error.message) || error.message;
    const errorCode = error.response && error.response.data && error.response.data.error ? error.response.data.error.code : null;
    const errorDetails = error.response && error.response.data && error.response.data.error ? error.response.data.error.error_data : null;
    
    return { 
      success: false, 
      error: errorMsg,
      errorCode: errorCode,
      errorDetails: errorDetails,
      fullError: error.response ? error.response.data : null
    };
  }
}

/**
 * Función principal para enviar recordatorios
 */
const sendWhatsAppReminder = async (req, res) => {
  try {
    console.log("🚀 INICIANDO ENVÍO DE RECORDATORIOS VIA META\n");
    const io = global.io;

    const reminders = await WhatsAppReminder.getRemindersForTomorrow();

    if (reminders.length === 0) {
      return res.status(200).json({ message: "No hay citas para mañana." });
    }

    io.emit("whatsapp:inicio", {
      total: reminders.length,
      timestamp: new Date().toISOString()
    });

    const resultados = { exitosos: 0, fallidos: 0, errores: [] };

    res.status(200).json({
      message: "Proceso de envío iniciado",
      total: reminders.length,
      sessionId: Date.now()
    });

    // Continuar en background
    (async () => {
      for (let i = 0; i < reminders.length; i++) {
        const reminder = reminders[i];
        
        const dir = obtenerDireccionPorEspecialidad(reminder.servicio);
        reminder.direccion1 = dir.direccion1;
        reminder.direccion2 = dir.direccion2;
        reminder.extra = dir.extra;

        console.log('\n[' + (i + 1) + '/' + reminders.length + '] ' + reminder.nombre_paciente);
        console.log('   Servicio: ' + reminder.servicio);
        console.log('   Dirección: ' + dir.direccion1);
        console.log('   Sede: ' + dir.direccion2);

        let numero = reminder.telefono;
        if (!numero.startsWith("+57")) {
          numero = "+57" + numero.replace(/^0+/, "");
        }

        io.emit("whatsapp:procesando", {
          current: i + 1,
          total: reminders.length,
          paciente: reminder.nombre_paciente,
          numero: numero,
          servicio: reminder.servicio,
          fecha: reminder.fecha
        });

        const resultado = await enviarPlantillaMeta(numero, reminder);

        if (resultado.success) {
          resultados.exitosos++;
          await WhatsAppReminder.updateReminderStatus(reminder.id, "recordatorio enviado");

          console.log('   ✅ ENVIADO');

          // Esperar 3 segundos antes de enviar el mensaje con botón
          await esperar(3000);

          // Enviar mensaje con botón de cancelar cita
          const resultadoBoton = await enviarMensajeConBotonCancelar(
            numero,
            reminder.id,
            reminder.nombre_paciente
          );

          if (!resultadoBoton.success) {
            console.log('   ⚠️ No se pudo enviar botón de cancelar, pero recordatorio fue exitoso');
          }

          io.emit("whatsapp:exito", {
            current: i + 1,
            total: reminders.length,
            paciente: reminder.nombre_paciente,
            numero: numero,
            exitosos: resultados.exitosos,
            fallidos: resultados.fallidos
          });
        } else {
          resultados.fallidos++;
          resultados.errores.push({ 
            numero: numero, 
            paciente: reminder.nombre_paciente, 
            error: resultado.error,
            errorCode: resultado.errorCode,
            fullError: resultado.fullError
          });
          
          console.log('   ❌ ERROR: ' + resultado.error);
          
          io.emit("whatsapp:error", {
            current: i + 1,
            total: reminders.length,
            paciente: reminder.nombre_paciente,
            numero: numero,
            error: resultado.error,
            errorCode: resultado.errorCode,
            exitosos: resultados.exitosos,
            fallidos: resultados.fallidos
          });
        }

        if (i < reminders.length - 1) {
          io.emit("whatsapp:pausa", {
            segundos: 2,
            mensaje: "Esperando 2 segundos..."
          });
          await esperar(2000);
          
          if ((i + 1) % 10 === 0) {
            io.emit("whatsapp:pausa", {
              segundos: 6,
              mensaje: "Pausa extendida de 6 segundos..."
            });
            await esperar(6000);
          }
        }
      }

      const reporte = {
        fecha: new Date().toISOString(),
        total: reminders.length,
        exitosos: resultados.exitosos,
        fallidos: resultados.fallidos,
        tasa_exito: ((resultados.exitosos / reminders.length) * 100).toFixed(1) + "%",
        errores: resultados.errores
      };

      io.emit("whatsapp:completado", reporte);

      const nombreReporte = 'reporte_whatsapp_' + new Date().toISOString().split("T")[0] + '.json';
      fs.writeFileSync(nombreReporte, JSON.stringify(reporte, null, 2));
      
      console.log('\n📊 RESUMEN:');
      console.log('   Total: ' + reporte.total);
      console.log('   Exitosos: ' + reporte.exitosos);
      console.log('   Fallidos: ' + reporte.fallidos);
      console.log('   Tasa de éxito: ' + reporte.tasa_exito);
      console.log('\n💾 Reporte guardado: ' + nombreReporte);
    })();

  } catch (error) {
    console.error("❌ Error general:", error);
    
    if (global.io) {
      global.io.emit("whatsapp:error_fatal", {
        error: error.message
      });
    }
    
    res.status(500).json({ 
      error: "Error al enviar recordatorios.",
      details: error.message 
    });
  }
};

function clasificarRespuesta(mensaje) {
  const m = mensaje.toLowerCase();
  if (m.includes("sí") || m.includes("si") || m.includes("confirmo")) return "confirmada";
  if (m.includes("no") || m.includes("cancelo") || m.includes("cancelar")) return "cancelada";
  if (m.includes("reagendar") || m.includes("cambiar") || m.includes("reprogramar")) return "reagendar";
  return "pendiente_clasificacion";
}

const processWhatsAppReply = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, numero, mensaje, fecha, tipo, DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha_formateada FROM mensajes ORDER BY fecha DESC"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No hay mensajes en la base de datos." });
    }

    const responses = rows.map(r => ({
      id: r.id,
      telefono: r.numero,
      mensaje: r.mensaje,
      fecha: r.fecha_formateada,
      estado: clasificarRespuesta(r.mensaje),
    }));

    res.json(responses);
  } catch (error) {
    console.error("❌ Error al obtener respuestas:", error);
    res.status(500).json({ error: "Error al obtener respuestas." });
  }
};

/**
 * Webhook de Meta para verificación (GET)
 * Meta envía un GET request para verificar el webhook
 */
const verifyWebhook = (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "mi_token_secreto_12345";

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ WEBHOOK VERIFICADO');
        res.status(200).send(challenge);
      } else {
        console.log('❌ VERIFICACIÓN FALLIDA');
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("❌ Error en verificación de webhook:", error);
    res.sendStatus(500);
  }
};

/**
 * Webhook de Meta para recibir mensajes (POST)
 * Maneja mensajes entrantes y botones interactivos
 */
const handleMetaWebhook = async (req, res) => {
  try {
    const body = req.body;

    // Responder rápido a Meta (requisito de Meta API)
    res.sendStatus(200);

    // Validar que sea una notificación de WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      console.log('⚠️ No es una notificación de WhatsApp Business');
      return;
    }

    // Procesar cada entrada
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const value = change.value;

          // Procesar mensajes
          if (value.messages) {
            for (const message of value.messages) {
              await procesarMensajeEntrante(message, value.metadata);
            }
          }

          // Procesar estados de mensajes (entregado, leído, etc.)
          if (value.statuses) {
            for (const status of value.statuses) {
              await procesarEstadoMensaje(status);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Error en webhook de Meta:", error);
  }
};

/**
 * Procesar mensaje entrante de WhatsApp
 */
async function procesarMensajeEntrante(message, metadata) {
  try {
    const from = message.from; // Número del remitente
    const messageId = message.id;
    const timestamp = message.timestamp;

    console.log('\n📨 MENSAJE ENTRANTE:');
    console.log('   De:', from);
    console.log('   Tipo:', message.type);

    // Manejar botón interactivo (cuando el paciente hace clic en "Cancelar Cita")
    if (message.type === 'interactive') {
      const buttonReply = message.interactive.button_reply;
      const buttonId = buttonReply.id;

      console.log('   Botón presionado:', buttonId);

      if (buttonId === 'cancel_appointment') {
        await iniciarFlujoCancelacion(from, messageId);
      }
    }

    // Manejar respuesta de texto (cuando el paciente envía el motivo)
    else if (message.type === 'text') {
      const textoMensaje = message.text.body;
      console.log('   Mensaje:', textoMensaje);

      // Verificar si el paciente está en medio de un flujo de cancelación
      const [conversaciones] = await db.query(
        `SELECT * FROM whatsapp_conversaciones
         WHERE telefono = ? AND estado_conversacion = 'esperando_motivo'
         ORDER BY created_at DESC LIMIT 1`,
        [from]
      );

      if (conversaciones.length > 0) {
        await completarCancelacion(conversaciones[0], textoMensaje);
      }
    }
  } catch (error) {
    console.error('❌ Error procesando mensaje entrante:', error);
  }
}

/**
 * Procesar estado de mensaje (entregado, leído, fallido)
 */
async function procesarEstadoMensaje(status) {
  try {
    const messageId = status.id;
    const statusType = status.status; // sent, delivered, read, failed

    console.log(`📊 Estado de mensaje ${messageId}: ${statusType}`);

    // Aquí puedes actualizar el estado en tu base de datos si lo necesitas
  } catch (error) {
    console.error('❌ Error procesando estado de mensaje:', error);
  }
}

/**
 * Iniciar flujo de cancelación cuando el paciente presiona "Cancelar Cita"
 */
async function iniciarFlujoCancelacion(telefono, messageId) {
  try {
    console.log('\n🔄 INICIANDO FLUJO DE CANCELACIÓN');
    console.log('   Teléfono:', telefono);

    // Buscar la cita del paciente para mañana
    const [citas] = await db.query(
      `SELECT * FROM citas
       WHERE TELEFONO_FIJO = ?
       AND DATE(FECHA_CITA) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
       AND ESTADO IN ('pendiente', 'recordatorio enviado')
       LIMIT 1`,
      [telefono.replace('+57', '')]
    );

    if (citas.length === 0) {
      console.log('   ⚠️ No se encontró cita para este número');
      await enviarMensajeTexto(telefono, 'No encontramos una cita programada para mañana con este número.');
      return;
    }

    const cita = citas[0];
    console.log('   ✅ Cita encontrada:', cita.ID);

    // Crear o actualizar conversación
    await db.query(
      `INSERT INTO whatsapp_conversaciones (telefono, cita_id, estado_conversacion, mensaje_id)
       VALUES (?, ?, 'esperando_motivo', ?)
       ON DUPLICATE KEY UPDATE
       estado_conversacion = 'esperando_motivo',
       mensaje_id = ?,
       updated_at = CURRENT_TIMESTAMP`,
      [telefono, cita.ID, messageId, messageId]
    );

    // Enviar mensaje solicitando el motivo
    const mensaje = `Por favor, indícanos el motivo de la cancelación de tu cita de ${cita.SERVICIO} programada para mañana ${cita.FECHA_CITA} a las ${cita.HORA_CITA}.

Escribe tu motivo y te confirmaremos la cancelación.`;

    await enviarMensajeTexto(telefono, mensaje);
    console.log('   ✅ Mensaje de solicitud de motivo enviado');

  } catch (error) {
    console.error('❌ Error iniciando flujo de cancelación:', error);
  }
}

/**
 * Completar cancelación cuando el paciente envía el motivo
 */
async function completarCancelacion(conversacion, motivo) {
  try {
    console.log('\n✅ COMPLETANDO CANCELACIÓN');
    console.log('   Cita ID:', conversacion.cita_id);
    console.log('   Motivo:', motivo);

    // Actualizar la cita como cancelada
    await db.query(
      `UPDATE citas
       SET ESTADO = 'cancelada',
           MOTIVO_CANCELACION = ?,
           FECHA_CANCELACION = NOW(),
           CANCELADO_POR = 'paciente'
       WHERE ID = ?`,
      [motivo, conversacion.cita_id]
    );

    // Marcar la conversación como completada
    await db.query(
      `UPDATE whatsapp_conversaciones
       SET estado_conversacion = 'completada',
           ultimo_mensaje = ?
       WHERE id = ?`,
      [motivo, conversacion.id]
    );

    // Obtener datos de la cita para el mensaje de confirmación
    const [citas] = await db.query(
      `SELECT * FROM citas WHERE ID = ?`,
      [conversacion.cita_id]
    );

    if (citas.length > 0) {
      const cita = citas[0];

      // Enviar mensaje de confirmación
      const mensajeConfirmacion = `✅ Tu cita ha sido cancelada exitosamente.

📋 Detalles:
• Servicio: ${cita.SERVICIO}
• Fecha: ${cita.FECHA_CITA}
• Hora: ${cita.HORA_CITA}
• Profesional: ${cita.PROFESIONAL}

Motivo registrado: ${motivo}

Si deseas agendar una nueva cita, comunícate con nosotros al 6077249701.

Gracias por informarnos.`;

      await enviarMensajeTexto(conversacion.telefono, mensajeConfirmacion);
      console.log('   ✅ Confirmación enviada al paciente');

      // Emitir evento de WebSocket para actualizar dashboard en tiempo real
      if (global.io) {
        global.io.emit('cita:cancelada', {
          citaId: cita.ID,
          paciente: cita.NOMBRE,
          servicio: cita.SERVICIO,
          fecha: cita.FECHA_CITA,
          motivo: motivo,
          timestamp: new Date().toISOString()
        });
      }
    }

  } catch (error) {
    console.error('❌ Error completando cancelación:', error);
    await enviarMensajeTexto(
      conversacion.telefono,
      'Lo sentimos, hubo un error al procesar tu cancelación. Por favor comunícate al 6077249701.'
    );
  }
}

/**
 * Enviar mensaje de texto simple vía Meta API
 */
async function enviarMensajeTexto(numero, texto) {
  try {
    const payload = {
      messaging_product: "whatsapp",
      to: numero,
      type: "text",
      text: {
        body: texto
      }
    };

    const response = await axios.post(
      META_WA_BASE_URL + '/' + META_PHONE_NUMBER_ID + '/messages',
      payload,
      {
        headers: {
          Authorization: 'Bearer ' + META_TOKEN,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return { success: true, response: response.data };
  } catch (error) {
    console.error('❌ Error enviando mensaje de texto:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendWhatsAppReminder,
  processWhatsAppReply,
  verifyWebhook,
  handleMetaWebhook,
};