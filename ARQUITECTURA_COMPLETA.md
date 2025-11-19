# ARQUITECTURA DEL PROYECTO JELCOM - RECORDATORIOS DE CITAS

## RESUMEN EJECUTIVO

Sistema integral de recordatorios de citas médicas que integra:
- **Carga**: Datos desde Excel
- **Canales**: WhatsApp, SMS, Email, Llamadas automáticas
- **Automatización**: Tareas programadas (cron jobs)
- **Inteligencia**: Chatbot que procesa respuestas de pacientes
- **Preparación**: Documentación SOAP de Salud360 disponible (no implementada)

---

## 1. ESTRUCTURA DEL PROYECTO

```
smsjelcom/
├── backend/                   # Express.js + Node.js
│   ├── api/                   # Documentación Salud360 SOAP
│   ├── config/                # Configuración de servicios
│   ├── controllers/           # Lógica de negocio
│   ├── middlewares/           # Auth, Rate limiting
│   ├── models/                # Modelos de datos
│   ├── routes/                # Rutas API
│   ├── uploads/               # Archivos Excel cargados
│   ├── index.js               # Servidor principal
│   ├── package.json           # Dependencias
│   └── .env                   # Variables de entorno
│
└── frontend/                  # React.js
    ├── src/
    │   ├── pages/             # Componentes UI
    │   ├── services/          # Llamadas API
    │   └── styles/            # CSS
    └── package.json
```

---

## 2. TECNOLOGÍAS

**Backend:**
- Express.js, MySQL2, Twilio, Meta API, LabsMobile, Nodemailer, node-cron, Socket.io, XLSX

**Frontend:**
- React.js, Axios, Socket.io-client

**Base de Datos:**
- MySQL (recordatorios_db)

---

## 3. ARCHIVOS CLAVE

### WhatsApp
```
/backend/controllers/whatsappController.js (442 líneas)
  - enviarPlantillaMeta()     # Envío via Meta API
  - sendWhatsAppReminder()    # Flujo completo
  - Mapeo automático de direcciones por especialidad

/backend/controllers/chatbotController.js
  - handleWhatsAppResponse()  # Procesa respuestas via UltraMsg
  - Clasifica: Sí/No/Reagendar
  - Respuestas automáticas

/backend/routes/whatsappRoutes.js
  GET  /api/whatsapp/enviar-recordatorios
  POST /api/whatsapp/webhook-ultramsg
```

### Excel
```
/backend/controllers/citasController.js (108 líneas)
  - procesarExcel()  # Procesa archivos XLSX
  - Validaciones automáticas
  - Conversión de fechas/horas

/backend/routes/citas.js
  POST /api/citas/subir-excel
```

### Configuración
```
/backend/.env (principales)
  DB_HOST, DB_USER, DB_PASS, DB_NAME
  EMAIL_USER, EMAIL_PASS
  LABSMOBILE_USER, LABSMOBILE_API_KEY
  META_TOKEN, META_PHONE_NUMBER_ID, META_WA_BASE_URL
  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
  JWT_SECRET, JWT_EXPIRATION
  BASE_URL, PORT, NODE_ENV

/backend/config/
  db.js                # Pool MySQL
  cronJobs.js          # Tareas programadas
  emailConfig.js       # SMTP Gmail
  twilioConfig.js      # Twilio
  labsmobileConfig.js  # LabsMobile
```

---

## 4. FLUJO DE CARGA DE EXCEL

```
Usuario upload Excel
    ↓
POST /api/citas/subir-excel + validación rol
    ↓
Multer: Guarda en /uploads/
    ↓
XLSX.readFile() → Lee primera hoja
    ↓
Validaciones:
  - NUMERO_IDE ✓
  - NOMBRE ✓
  - FECHA_CITA (Excel/DD-MM-YYYY) → YYYY-MM-DD
  - HORA_CITA (Excel/HH:MM) → HH:MM:SS
  - TELEFONO_FIJO (7-10 dígitos)
    ↓
INSERT INTO citas
    ↓
Respuesta: {"message": "Archivo procesado..."}
```

**Estructura Excel esperada:**
```
ATENCION | FECHA_CITA | HORA_CITA | SERVICIO | PROFESIONAL | 
TIPO_IDE_PACIENTE | NUMERO_IDE | NOMBRE | TELEFONO_FIJO | EMAIL
```

---

## 5. ENVÍO DE RECORDATORIOS WHATSAPP

### Flujo
```
GET /api/whatsapp/enviar-recordatorios
    ↓
WhatsAppReminder.getRemindersForTomorrow()
  SELECT * FROM citas WHERE DATE(FECHA_CITA) = MAÑANA AND ESTADO = 'pendiente'
    ↓
Para cada cita:
  1. obtenerDireccionPorEspecialidad(SERVICIO)
  2. Formatea teléfono: +57XXXXXXXXXX
  3. enviarPlantillaMeta(numero, reminder)
  4. Socket.io: whatsapp:exito / whatsapp:error
  5. UPDATE citas SET ESTADO = 'recordatorio enviado'
  6. Espera 2s (6s cada 10)
    ↓
Genera reporte JSON
Socket.io: whatsapp:completado
```

### Mapeo de Direcciones

El sistema tiene mapeo automático para 50+ especialidades:

```
CALLE 16 NO 9-76 (Cardiología)
  → CARDIOLOGIA PROCEDIMIENTOS, CARDIOLOGIA PEDIATRICA PROCEDIMIENTOS

CES - Avenida Santander 24A-48 (Consulta Externa)
  → MEDICINA FAMILIAR, DERMATOLOGIA, GINECOLOGIA, PEDIATRIA, 
    PSICOLOGIA, NEUROLOGIA, UROLOGIA, etc. (40+ especialidades)

HOSPITAL - Carrera 5 # 9-102 (Sede Principal)
  → ANESTESIOLOGIA, COLONOSCOPIA, GASTROENTEROLOGIA, 
    QX OTORRINO, QX GINECOLOGIA, QX ORTOPEDIA, etc.

EDIFICIO PSI LOCAL 2 CRA 14A NO 29-27 (Endodoncia)
  → ENDODONCIA PROCEDIMIENTOS, ENDODONCIA

CALLE 9 NO 9-41 (Periodoncia)
  → PERIODONCIA
```

Ver líneas 18-164 de `/backend/controllers/whatsappController.js`

### Plantilla Meta WhatsApp

**Nombre:** `recordatorio_citas`  
**Idioma:** Spanish (es)  
**Parámetros:** 8

```
Header: Imagen (Google Drive URL)
Body:
  1. {nombre_paciente}
  2. {fecha} → "jueves 27 de noviembre de 2025"
  3. {hora} → "02:30 PM"
  4. {servicio} → "MEDICINA GENERAL"
  5. {profesional} → Nombre doctor
  6. {direccion1} → "Avenida Santander 24A-48"
  7. {direccion2} → "Consulta Externa CES Hospital Regional de San Gil"
  8. {extra} → Advertencias especiales (ej: "Dirigirse primero al CES")
```

### Meta API

```
Endpoint: https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages
Método: POST
Headers: Authorization: Bearer {META_TOKEN}

Configuración en .env:
  META_TOKEN=EAAQwHZBVmMvoBPlJL4Uw0PbHNMCE4qwB5TAW...
  META_PHONE_NUMBER_ID=812615988604220
  META_WA_BASE_URL=https://graph.facebook.com/v17.0/
```

---

## 6. RECEPCIÓN Y PROCESAMIENTO DE RESPUESTAS WHATSAPP

### Flujo
```
Paciente responde en WhatsApp
    ↓
UltraMsg webhook → POST /api/whatsapp/webhook-ultramsg
    ↓
handleWhatsAppResponse() en chatbotController.js
    ↓
Clasifica respuesta:
  "sí"/"si"/"confirmo" → estado = "confirmada"
  "no"/"cancelo" → estado = "cancelada"
  "reagendar"/"cambiar" → estado = "reagendamiento solicitado"
    ↓
saveMessage() → INSERT INTO mensajes
    ↓
Envía respuesta automática via UltraMsg API
    ↓
updateReminderStatus() → UPDATE mensajes SET estado = ...
```

**Validaciones:**
- No permite cambiar estado si ya fue procesado
- Detecta duplicados por teléfono + semana
- Obtiene cita más reciente del paciente

---

## 7. ENDPOINTS PRINCIPALES

```
CITAS/EXCEL
  POST /api/citas/subir-excel                  Cargar Excel

WHATSAPP
  GET  /api/whatsapp/enviar-recordatorios      Enviar recordatorios
  POST /api/whatsapp/webhook-ultramsg          Webhook respuestas

SMS (LabsMobile)
  POST /api/sms/enviar-recordatorios           SMS recordatorios
  GET  /api/sms/saldo                          Saldo disponible
  POST /api/sms/enviar-sms-manual              SMS manual

EMAIL (Nodemailer/Gmail)
  POST /api/correo/enviar-recordatorios        Correos recordatorios
  POST /api/correo/enviar-manual               Correo manual

LLAMADAS (Twilio)
  GET  /api/voz/llamada/:citaId                Iniciar llamada
  POST /api/voz/status-callback/:citaId        Callback estado

HISTORIAL
  GET  /api/envios/historial                   Historial envíos
  GET  /api/envios/estadisticas                Estadísticas
  GET  /api/envios/historial/:id               Detalle específico
  POST /api/envios/reintentar/:id              Reintentar envío

AUTENTICACIÓN
  POST /api/auth/register                      Registrar usuario
  POST /api/auth/login                         Login

DASHBOARD
  GET  /api/dashboard/...                      Datos dashboard
```

---

## 8. BASE DE DATOS

### Tabla: citas
```sql
CREATE TABLE citas (
  ID              INT PRIMARY KEY AUTO_INCREMENT,
  ATENCION        VARCHAR(255) NOT NULL,
  FECHA_CITA      DATE NOT NULL,
  HORA_CITA       TIME NOT NULL,
  SERVICIO        VARCHAR(255) NOT NULL,
  PROFESIONAL     VARCHAR(255) NOT NULL,
  TIPO_IDE_PACIENTE VARCHAR(50) NOT NULL,
  NUMERO_IDE      VARCHAR(50) NOT NULL,
  NOMBRE          VARCHAR(255) NOT NULL,
  TELEFONO_FIJO   VARCHAR(20),
  EMAIL           VARCHAR(255),
  ESTADO          VARCHAR(50) DEFAULT 'pendiente',
  CREATED_AT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Estados posibles:
  - 'pendiente' (sin recordatorio)
  - 'recordatorio enviado'
  - 'confirmada' (paciente confirmó)
  - 'cancelada' (paciente canceló)
  - 'reagendamiento solicitado'
```

### Tabla: mensajes
```sql
CREATE TABLE mensajes (
  id              VARCHAR(255) PRIMARY KEY,
  numero          VARCHAR(20) NOT NULL,
  mensaje         TEXT NOT NULL,
  fecha           TIMESTAMP NOT NULL,
  tipo            VARCHAR(20),    -- 'entrante' o 'saliente'
  estado          VARCHAR(50)     -- estado de la cita
);
```

---

## 9. SALUD360 - ESTADO ACTUAL

### WebServices Documentados (NO IMPLEMENTADOS)

Base URL: `http://hs.salud360.app/Salud360Hs/servlet/`

**9 WebServices SOAP disponibles:**
1. **WSBuscarPaciente** - awsbuscarpaciente
2. **WSActualizarPaciente** - awsactualizarpaciente
3. **WSBuscarCitasSedePaciente** - awsbuscarcitassedepaciente
4. **WSProximasCitas** - awsproximascitas
5. **WSHistoricoCitas** - awshistoricocitas
6. **WSCancelarCitas** - awscancelarcita
7. **WSAsignarCitaPaciente2** - awsasignarcitapaciente2
8. **WSConvenioPoblacionPaciente** - awsconveniopoblacionpaciente
9. **WSRecomendacionesRecordatorio** - awsrecomendacionesrecordatorio

### Documentación
```
/backend/api/Anexo 1-30 - WSDL SOAP XML files
/backend/api/Documentacion WS San Gil Produccion.pdf (434 KB)
```

### Para Implementar

1. Agregar credenciales a .env:
   ```
   SALUD360_USER=username
   SALUD360_PASS=password
   SALUD360_HOMSEDCIUCLI=1  # Código sede
   SALUD360_URL=http://hs.salud360.app/Salud360Hs/servlet/
   ```

2. Crear cliente SOAP (puede usar `soap` npm package)

3. Reemplazar carga Excel por llamadas a WSBuscarCitasSedePaciente

4. Integrar WSCancelarCitas con sistema de cancelaciones

5. Usar WSRecomendacionesRecordatorio para personalizar mensajes

---

## 10. INTEGRACIONES EXTERNAS (ACTIVAS)

| Servicio | API Type | Propósito | Archivo Config |
|----------|----------|----------|-----------------|
| Meta WhatsApp | REST | Envío plantillas | whatsappController.js |
| LabsMobile | REST | SMS | sms2controller.js |
| Twilio | REST | Llamadas | voiceController.js |
| Gmail SMTP | SMTP | Correos | correoController.js |
| UltraMsg | Webhook | Recepción WA | chatbotController.js |
| Salud360 | SOAP | Datos (PENDIENTE) | /api/Anexo*.xml |

---

## 11. FLUJO COMPLETO DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────┐
│               SISTEMA INTEGRAL DE RECORDATORIOS              │
└─────────────────────────────────────────────────────────────┘

DÍA 1:
  1. Usuario carga Excel con citas de MAÑANA
     Excel → /api/citas/subir-excel → INSERT citas (ESTADO='pendiente')

DÍA 2 - 8:00 AM:
  2. Cron job automático O llamada manual
     GET /api/whatsapp/enviar-recordatorios
       ↓
     Obtiene citas de HOY (ESTADO='pendiente')
       ↓
     Obtiene dirección por especialidad
       ↓
     Envía plantilla Meta a cada paciente
       ↓
     UPDATE citas SET ESTADO='recordatorio enviado'
       ↓
     Socket.io emite eventos en tiempo real al frontend

  3. Frontend muestra progreso:
     - Enviando... → ✓ Enviado → ✗ Error
     - Reporte final con tasa de éxito

DÍA 2 - EN TIEMPO REAL:
  4. Pacientes responden en WhatsApp
     Respuesta → UltraMsg webhook → /api/whatsapp/webhook-ultramsg
       ↓
     handleWhatsAppResponse() clasifica
       ↓
     Envía respuesta automática
       ↓
     UPDATE mensajes/citas con estado

CUALQUIER MOMENTO:
  5. Dashboard muestra:
     - Citas enviadas hoy
     - Confirmaciones vs cancelaciones
     - Tasa de éxito
     - Historial con filtros
     - Estadísticas por fecha/rango

OPORTUNIDAD:
  6. Integrar con Salud360 para:
     - Obtener citas automáticamente
     - Cancelar/reprogramar en sistema origen
     - Sincronización bidireccional
```

---

## 12. COMPONENTES FRONTEND PRINCIPALES

```
/frontend/src/pages/
  SendWhatsApp.js              # UI envío WhatsApp + progreso
  ProgramarRecordatorio.js      # Programación cron
  UploadExcel.js                # Carga de Excel
  HistorialEnvios.js            # Historial con filtros
  Dashboard.js                  # Estadísticas gráficos
  SendSms.js                    # UI SMS
  SendEmails.js                 # UI Correos
  
/frontend/src/services/
  whatsappService.js            # Llamadas API WhatsApp
  smsService.js                 # Llamadas API SMS
  emailService.js               # Llamadas API Email
```

---

## 13. AUTENTICACIÓN Y SEGURIDAD

```
JWT Token (Header: Authorization: Bearer {token})
  - Duración: 7 días
  - Secret: supersecreto123

Rate Limiting:
  - Middleware: express-rate-limit

Validación de Roles:
  - 'admin'  (acceso total)
  - 'usuario' (acceso limitado)

Multer:
  - Solo .xlsx, .xls
  - Almacena en /uploads/
```

---

## 14. ARCHIVOS DE CONFIGURACIÓN IMPORTANTES

**En .env:**
```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=recordatorios_db
DB_PORT=3306

EMAIL_USER=msalazar5@udi.edu.co
EMAIL_PASS=M1005450340s@

LABSMOBILE_USER=sistemas@jelcom.com.co
LABSMOBILE_API_KEY=mB9y5TBGdNVy3MNoJGs6D3HDLYPplEky

META_TEMPLATE_NAME=recordatorio_citas
META_PHONE_NUMBER_ID=812615988604220
META_WA_BASE_URL=https://graph.facebook.com/v17.0/
META_TOKEN=EAAQwHZBVmMvoBPlJL4Uw0PbHNMCE4qwB5TAW...

TWILIO_ACCOUNT_SID=AC6f9cc47d876b9606cfcdc0b47182e0a9
TWILIO_AUTH_TOKEN=1cf1403e4e2c454e8af99e71e19a7d63
TWILIO_PHONE_NUMBER=+576076911306

JWT_SECRET=supersecreto123
JWT_EXPIRATION=7d

BASE_URL=https://528df888edc0.ngrok.app
PORT=3001
NODE_ENV=production
CLIENT_URL=http://localhost:3002
```

---

## 15. DEPENDENCIAS PRINCIPALES

```json
{
  "express": "^4.21.2",
  "mysql2": "^3.12.0",
  "axios": "^1.8.1",
  "twilio": "^5.4.5",
  "labsmobile-sms": "^1.0.1",
  "nodemailer": "^6.10.0",
  "node-cron": "^3.0.3",
  "socket.io": "^4.8.1",
  "xlsx": "^0.18.5",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.4.7",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "express-validator": "^7.2.1",
  "express-rate-limit": "^7.5.0"
}
```

---

## CONCLUSIÓN

Este es un sistema **robusto, modular y extensible** para:
- ✓ Carga de datos desde Excel
- ✓ Envío de recordatorios multicanal (WhatsApp, SMS, Email, Llamadas)
- ✓ Automatización de tareas (Cron)
- ✓ Procesamiento inteligente de respuestas
- ✓ Reportes y estadísticas en tiempo real
- ✓ Preparado para integración con Salud360 (documentación SOAP disponible)

**Próximos pasos recomendados:**
1. Implementar integración SOAP con Salud360
2. Mejorar persistencia de eventos (base de datos para reportes)
3. Agregar validación adicional de teléfonos
4. Implementar reintentos automáticos para fallos
5. Mejorar seguridad de credenciales (.env → vault)

