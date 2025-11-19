# 📱 Guía: Sistema de Cancelación de Citas por WhatsApp

## 📋 Índice
1. [Resumen del Sistema](#resumen-del-sistema)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Cómo Probar el Sistema](#cómo-probar-el-sistema)
4. [Flujo del Usuario](#flujo-del-usuario)
5. [Dashboard de Administrador](#dashboard-de-administrador)
6. [Configuración de Meta WhatsApp Business](#configuración-de-meta-whatsapp-business)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Resumen del Sistema

Este sistema permite a los pacientes cancelar o confirmar sus citas médicas directamente desde WhatsApp mediante botones interactivos. El sistema:

- ✅ Envía recordatorios de citas con botones de "Cancelar Cita" y "Mantener Cita"
- ✅ Solicita motivo de cancelación al paciente cuando cancela
- ✅ Confirma la asistencia cuando el paciente mantiene la cita
- ✅ Registra todas las cancelaciones y confirmaciones en base de datos
- ✅ Actualiza el dashboard en tiempo real
- ✅ Envía confirmación automática al paciente
- ✅ Deshabilita los botones después de cualquier interacción (evita múltiples respuestas)

---

## 🔧 Instalación y Configuración

### Paso 1: Ejecutar Migraciones de Base de Datos

```bash
cd backend
mysql -u tu_usuario -p tu_base_de_datos < migrations/001_add_cancellation_fields.sql
mysql -u tu_usuario -p tu_base_de_datos < migrations/002_add_confirmada_estado.sql
```

Esto creará:
- Campos de cancelación en tabla `citas`: `MOTIVO_CANCELACION`, `FECHA_CANCELACION`, `CANCELADO_POR`
- Tabla `whatsapp_conversaciones` para rastrear el flujo de mensajes
- Estado 'confirmada' en la tabla de conversaciones
- Índices para mejorar el rendimiento

### Paso 2: Configurar Variables de Entorno

Agrega a tu archivo `.env`:

```env
# Configuración existente de Meta WhatsApp
META_TOKEN=tu_token_de_acceso
META_PHONE_NUMBER_ID=tu_phone_number_id
META_WA_BASE_URL=https://graph.facebook.com/v21.0

# Nueva variable para verificación de webhook
META_VERIFY_TOKEN=mi_token_secreto_12345
```

**IMPORTANTE**: Cambia `mi_token_secreto_12345` por un token secreto único.

### Paso 3: Reiniciar el Servidor

```bash
cd backend
npm install
npm start
```

---

## 🧪 Cómo Probar el Sistema

### Opción 1: Usar Datos de Prueba (Recomendado)

1. **Cargar datos de prueba:**
```bash
cd backend
mysql -u tu_usuario -p tu_base_de_datos < seeders/test_appointments_seeder.sql
```

Esto creará **8 citas de prueba para mañana** con números ficticios.

2. **Verificar que las citas se crearon:**
```bash
mysql -u tu_usuario -p tu_base_de_datos

SELECT ID, NOMBRE, FECHA_CITA, HORA_CITA, SERVICIO, TELEFONO_FIJO, ESTADO
FROM citas
WHERE NOMBRE LIKE '%[PRUEBA]%'
ORDER BY HORA_CITA;
```

3. **Modificar un número de teléfono para usar el tuyo:**
```sql
UPDATE citas
SET TELEFONO_FIJO = '3001234567'  -- Tu número real
WHERE ID = (SELECT ID FROM citas WHERE NOMBRE LIKE '%[PRUEBA]%' LIMIT 1);
```

4. **Enviar recordatorios:**
```bash
# Desde tu navegador o usando curl
curl http://localhost:5000/api/whatsapp/enviar-recordatorios
```

### Opción 2: Crear Citas Manualmente

Si necesitas crear citas específicas:

```sql
INSERT INTO citas (
  ATENCION,
  FECHA_CITA,
  HORA_CITA,
  SERVICIO,
  PROFESIONAL,
  TIPO_IDE_PACIENTE,
  NUMERO_IDE,
  NOMBRE,
  TELEFONO_FIJO,
  EMAIL,
  ESTADO
) VALUES (
  'PRINCIPAL',
  DATE_ADD(CURDATE(), INTERVAL 1 DAY),  -- Mañana
  '10:00:00',                            -- Hora de la cita
  'MEDICINA GENERAL',
  'DR. JUAN PEREZ',
  'CC',
  '1000000001',
  'TU NOMBRE [PRUEBA]',
  '3001234567',                          -- TU NÚMERO DE WHATSAPP
  'test@example.com',
  'pendiente'
);
```

---

## 📱 Flujo del Usuario (Paciente)

### 1. Recibe Recordatorio
El paciente recibe 2 mensajes de WhatsApp:

**Mensaje 1: Plantilla de recordatorio**
```
🏥 Hospital Regional de San Gil
Hola Juan Perez,

Te recordamos tu cita:
📅 Fecha: Miércoles 20 de noviembre de 2025
🕐 Hora: 10:00 AM
👨‍⚕️ Servicio: MEDICINA GENERAL
👨‍⚕️ Profesional: DR. JUAN PEREZ

📍 Dirección: Avenida Santander 24A-48
Consulta Externa CES Hospital Regional de San Gil
```

**Mensaje 2: Botón interactivo (3 segundos después)**
```
Hola Juan Perez, ¿necesitas cancelar tu cita?

Si no puedes asistir, presiona el botón de abajo para cancelarla.

[Botón: Cancelar Cita] [Botón: Mantener Cita]
```

### 2A. Flujo de Cancelación

**2A.1. Paciente Cancela**
El paciente presiona el botón **"Cancelar Cita"**

**2A.2. Sistema Solicita Motivo**
El sistema responde automáticamente:
```
Por favor, indícanos el motivo de la cancelación de tu cita de MEDICINA GENERAL
programada para mañana 2025-11-20 a las 10:00:00.

Escribe tu motivo y te confirmaremos la cancelación.
```

**2A.3. Paciente Envía Motivo**
El paciente responde con texto libre:
```
No puedo asistir porque tengo que viajar por trabajo
```

**2A.4. Sistema Confirma Cancelación**
El sistema registra la cancelación y envía confirmación:
```
✅ Tu cita ha sido cancelada exitosamente.

📋 Detalles:
• Servicio: MEDICINA GENERAL
• Fecha: 2025-11-20
• Hora: 10:00:00
• Profesional: DR. JUAN PEREZ

Motivo registrado: No puedo asistir porque tengo que viajar por trabajo

Si deseas agendar una nueva cita, comunícate con nosotros al 6077249701.

Gracias por informarnos.
```

### 2B. Flujo de Confirmación

**2B.1. Paciente Confirma**
El paciente presiona el botón **"Mantener Cita"**

**2B.2. Sistema Confirma Asistencia**
El sistema registra la confirmación y envía mensaje:
```
✅ ¡Perfecto! Tu asistencia ha sido confirmada.

📋 Detalles de tu cita:
• Servicio: MEDICINA GENERAL
• Fecha: 2025-11-20
• Hora: 10:00:00
• Profesional: DR. JUAN PEREZ

Te esperamos. Si tienes alguna duda, llámanos al 6077249701.

¡Gracias por confirmar!
```

### 3. Prevención de Múltiples Respuestas

**Si el paciente intenta presionar otro botón después de haber respondido:**
```
⚠️ Ya has respondido anteriormente. Si necesitas ayuda adicional, comunícate al 6077249701.
```

Este mecanismo previene que los pacientes:
- Cancelen después de haber confirmado
- Confirmen después de haber cancelado
- Envíen múltiples cancelaciones

---

## 📊 Dashboard de Administrador

El dashboard ahora incluye nuevas secciones de cancelaciones:

### Métricas Principales
- **Cancelaciones Totales**: Total de citas canceladas
- **Cancelaciones Hoy**: Cancelaciones del día actual
- **Tasa de Cancelación**: Porcentaje de citas canceladas vs. programadas

### Gráficos Nuevos
1. **Motivos de Cancelación** (Gráfico de torta)
   - Problemas de salud
   - Trabajo/Ocupado
   - Viaje
   - Asuntos personales
   - Reagendar
   - Otros motivos

2. **Cancelaciones por Día** (Últimos 7 días)
   - Muestra tendencias de cancelaciones

3. **Lista de Citas Canceladas**
   - Tabla con últimas 50 citas canceladas
   - Incluye: Paciente, Servicio, Fecha, Motivo, Cancelado por

### Acceder al Dashboard
```
http://localhost:3000/dashboard
```

---

## 🔗 Configuración de Meta WhatsApp Business

### Paso 1: Configurar Webhook

1. Ve a **Meta Business Suite** → **WhatsApp** → **Configuración de API**
2. En la sección **Webhook**, haz clic en **Configurar**
3. Ingresa:
   - **URL del Callback**: `https://tu-dominio.com/api/whatsapp/webhook`
   - **Token de Verificación**: El mismo valor que pusiste en `META_VERIFY_TOKEN`
4. Suscríbete a los siguientes campos:
   - ✅ `messages`
   - ✅ `message_status`

### Paso 2: Exponer tu Servidor Local (Para Pruebas)

Si estás probando localmente, usa **ngrok**:

```bash
# Instalar ngrok
npm install -g ngrok

# Exponer tu servidor
ngrok http 5000

# Copia la URL HTTPS que te da (ej: https://abc123.ngrok.io)
# Úsala como tu webhook URL: https://abc123.ngrok.io/api/whatsapp/webhook
```

### Paso 3: Verificar Webhook

Meta enviará una petición GET para verificar. Si configuraste correctamente:
- Deberías ver en consola: `✅ WEBHOOK VERIFICADO`

---

## 🐛 Solución de Problemas

### Problema 1: No recibo mensajes en el webhook

**Solución:**
1. Verifica que el webhook esté correctamente configurado en Meta
2. Verifica que `META_VERIFY_TOKEN` sea el mismo en `.env` y en Meta
3. Revisa los logs del servidor:
```bash
tail -f backend/logs/app.log  # Si tienes logs
```

### Problema 2: El botón no aparece

**Posibles causas:**
- Meta no permite mensajes interactivos a números no verificados (primeras 24 horas)
- El número del paciente no está en WhatsApp

**Solución:**
- Espera 24 horas después de que el paciente te envíe el primer mensaje
- O usa un número de prueba aprobado por Meta

### Problema 3: La base de datos no tiene los campos de cancelación

**Solución:**
```bash
# Verifica que la migración se ejecutó correctamente
mysql -u tu_usuario -p tu_base_de_datos

SHOW COLUMNS FROM citas LIKE '%CANCEL%';

# Deberías ver:
# MOTIVO_CANCELACION
# FECHA_CANCELACION
# CANCELADO_POR
```

### Problema 4: El dashboard no muestra las cancelaciones

**Solución:**
1. Verifica que el endpoint funcione:
```bash
curl http://localhost:5000/api/dashboard/stats
```

2. Deberías ver JSON con:
```json
{
  "citasCanceladas": [...],
  "motivosCancelacion": [...],
  "cancelacionesPorDia": [...],
  "tasaCancelacion": { ... }
}
```

---

## 📝 Estructura de la Base de Datos

### Tabla `citas` (Modificada)
```sql
- MOTIVO_CANCELACION (TEXT) - Motivo proporcionado por el paciente
- FECHA_CANCELACION (DATETIME) - Cuándo se canceló
- CANCELADO_POR (VARCHAR) - 'paciente', 'sistema', 'administrador'
- ESTADO (VARCHAR) - Ahora incluye 'cancelada'
```

### Tabla `whatsapp_conversaciones` (Nueva)
```sql
- id (INT) - ID único
- telefono (VARCHAR) - Número del paciente
- cita_id (INT) - ID de la cita
- estado_conversacion (VARCHAR) - 'esperando_respuesta', 'esperando_motivo', 'completada', 'confirmada', 'cancelada'
- mensaje_id (VARCHAR) - ID del mensaje de WhatsApp
- ultimo_mensaje (TEXT) - Último mensaje recibido
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🔐 Seguridad

1. **Token de Verificación**: Nunca compartas tu `META_VERIFY_TOKEN`
2. **Token de Acceso**: Mantén seguro tu `META_TOKEN`
3. **Validación**: El sistema valida que los mensajes vengan de WhatsApp Business
4. **Rate Limiting**: Considera implementar límites de requests

---

## 📞 Contacto y Soporte

- Para problemas técnicos, revisa los logs del servidor
- Para configuración de Meta, consulta: https://developers.facebook.com/docs/whatsapp
- Para reportar bugs, crea un issue en el repositorio

---

## ✅ Checklist de Implementación

- [ ] Ejecutar migración de base de datos
- [ ] Configurar variables de entorno
- [ ] Configurar webhook en Meta WhatsApp Business
- [ ] Cargar datos de prueba
- [ ] Probar envío de recordatorios
- [ ] Probar flujo de cancelación completo
- [ ] Verificar dashboard con datos de cancelaciones
- [ ] Limpiar datos de prueba (opcional)

---

¡Todo listo! El sistema está preparado para recibir y procesar cancelaciones de citas por WhatsApp. 🚀
