# 📄 Configuración de Plantilla de WhatsApp en Meta

## Plantilla Actual: `recordatorio_citas`

La plantilla existente ya funciona correctamente. El sistema de cancelación **NO** requiere modificar la plantilla existente.

## ¿Por qué no se modifica la plantilla?

Meta tiene un proceso de aprobación largo (24-48 horas) para plantillas. Por eso, el sistema usa:

1. **Plantilla existente** (`recordatorio_citas`) - Para el recordatorio inicial
2. **Mensaje interactivo dinámico** - Para el botón de cancelar (NO requiere aprobación)

## Flujo de Mensajes

```
┌─────────────────────────────────────────────┐
│ 1. Envío de Plantilla "recordatorio_citas" │
│    (Ya aprobada, NO modificada)             │
└─────────────────────────────────────────────┘
              ↓ (3 segundos después)
┌─────────────────────────────────────────────┐
│ 2. Mensaje Interactivo con Botones         │
│    - Cancelar Cita                          │
│    - Mantener Cita                          │
│    (NO requiere aprobación de Meta)         │
└─────────────────────────────────────────────┘
```

## Ventajas de Este Enfoque

✅ **Sin espera**: No necesitas esperar aprobación de Meta
✅ **Flexible**: Puedes cambiar el texto del botón cuando quieras
✅ **Rápido**: Implementación inmediata
✅ **Compatible**: Funciona con la plantilla existente

## Código del Mensaje Interactivo

El mensaje se crea dinámicamente en `whatsappController.js`:

```javascript
{
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
}
```

## Personalización

Si quieres cambiar el texto de los botones o el mensaje, edita el archivo:
- `backend/controllers/whatsappController.js`
- Función: `enviarMensajeConBotonCancelar()`

### Ejemplo de Personalización

```javascript
// Cambiar texto del botón
{
  id: "cancel_appointment",
  title: "❌ Cancelar"  // Máximo 20 caracteres
}

// Cambiar mensaje
body: {
  text: `Hola, si necesitas cancelar tu cita médica de mañana, presiona el botón de abajo. También puedes llamarnos al 6077249701.`
}
```

## Limitaciones de Meta WhatsApp

1. **Máximo 3 botones** por mensaje interactivo
2. **Máximo 20 caracteres** por título de botón
3. **Ventana de 24 horas**: Solo puedes enviar mensajes interactivos dentro de 24 horas después de que el usuario te envíe un mensaje (o si usas plantilla aprobada primero)

## Solución a la Ventana de 24 Horas

El sistema resuelve esto enviando primero la **plantilla aprobada** (recordatorio), lo que abre la ventana de 24 horas. Luego envía el **mensaje interactivo** con los botones.

---

## Opcional: Crear Nueva Plantilla con Botones

Si en el futuro quieres crear una plantilla con botones integrados:

### Paso 1: Ir a Meta Business Manager
1. https://business.facebook.com
2. WhatsApp Manager → Message Templates → Create Template

### Paso 2: Configurar la Plantilla

**Nombre**: `recordatorio_con_cancelacion`
**Categoría**: UTILITY
**Idioma**: Spanish (ES)

**Header**:
```
Image (URL): https://drive.google.com/uc?export=view&id=1wHMGC9zodGNy6C49k2fIj8zDcHQlu5LT
```

**Body**:
```
Hola {{1}},

Te recordamos tu cita:
📅 Fecha: {{2}}
🕐 Hora: {{3}}
👨‍⚕️ Servicio: {{4}}
👨‍⚕️ Profesional: {{5}}

📍 Dirección:
{{6}}
{{7}}

{{8}}

¿Necesitas cancelar?
```

**Footer** (opcional):
```
Hospital Regional de San Gil
```

**Buttons**:
1. Quick Reply: "Cancelar Cita" (ID: `cancel_appointment`)
2. Quick Reply: "Confirmar Asistencia" (ID: `confirm_appointment`)

### Paso 3: Enviar para Aprobación
- Meta tarda 24-48 horas en aprobar
- Recibirás email cuando esté aprobada

### Paso 4: Actualizar el Código

Una vez aprobada, actualiza `whatsappController.js`:

```javascript
const payload = {
  messaging_product: "whatsapp",
  to: numero,
  type: "template",
  template: {
    name: "recordatorio_con_cancelacion",  // Nuevo nombre
    language: { code: "es" },
    components: [
      // ... header y body como antes ...
      {
        type: "button",
        sub_type: "quick_reply",
        index: "0",
        parameters: [
          {
            type: "payload",
            payload: "cancel_appointment"
          }
        ]
      }
    ]
  }
};
```

---

## Recomendación Final

**Mantén el enfoque actual** (plantilla + mensaje interactivo) porque:
- Es más rápido de implementar
- No requiere aprobación
- Es más flexible para cambios futuros
- Cumple con las políticas de Meta

Solo crea una nueva plantilla si necesitas:
- Enviar mensajes fuera de la ventana de 24 horas
- Tener un diseño más profesional/consistente
- Cumplir con requisitos específicos de negocio
