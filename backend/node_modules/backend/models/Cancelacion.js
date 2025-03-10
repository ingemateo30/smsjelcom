const db = require('../config/db.js');

class cancelacion {
    static async obtenerCitaPendiente(telefono) {
        const [citas] = await db.execute(
            "SELECT * FROM citas WHERE TELEFONO_FIJO = ? AND ESTADO = 'pendiente' OR ESTADO = 'recordatorio enviado",
            [telefono]
        );
        return citas[0];
    }

    static async confirmarCita(telefono) {
        await db.execute(
            "UPDATE citas SET ESTADO = 'confirmada' WHERE TELEFONO_FIJO = ? AND ESTADO = 'pendiente' OR ESTADO = 'recordatorio enviado'",
            [telefono]
        );
    }

    static async cancelarCita(telefono, motivo) {
        await db.execute(
            "UPDATE citas SET ESTADO = 'cancelada', motivo_cancelacion = ? WHERE TELEFONO_FIJO = ? AND ESTADO = 'pendiente' OR ESTADO = 'recordatorio enviado'",
            [motivo, telefono]
        );
    }
}

module.exports = cancelacion;
