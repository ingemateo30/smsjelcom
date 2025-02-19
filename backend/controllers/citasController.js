const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const db = require("../config/db");

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, "citas_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const procesarExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se ha subido ningún archivo" });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const row of data) {
            let {
                ATENCION,
                FECHA_CITA,
                HORA_CITA,
                SERVICIO,
                PROFESIONAL,
                TIPO_IDE_PACIENTE,
                NUMERO_IDE,
                NOMBRE,
                TELEFONO_FIJO
            } = row;

            // Convertir FECHA_CITA al formato correcto (YYYY-MM-DD)
            if (FECHA_CITA) {
                if (typeof FECHA_CITA === "number") {
                    const excelDate = new Date((FECHA_CITA - 25569) * 86400 * 1000);
                    FECHA_CITA = excelDate.toISOString().split("T")[0]; // YYYY-MM-DD
                } else {
                    const [day, month, year] = FECHA_CITA.split("/");
                    FECHA_CITA = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                }
            } else {
                FECHA_CITA = null;
            }

            // Convertir HORA_CITA al formato correcto (HH:MM:SS)
            if (HORA_CITA) {
                if (typeof HORA_CITA === "number") {
                    let totalSeconds = Math.round(HORA_CITA * 86400);
                    let hours = Math.floor(totalSeconds / 3600);
                    let minutes = Math.floor((totalSeconds % 3600) / 60);
                    let seconds = totalSeconds % 60;
                    HORA_CITA = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                } else if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(HORA_CITA)) {
                    HORA_CITA = HORA_CITA.padEnd(8, ":00"); // Asegura que tenga formato HH:MM:SS
                } else {
                    HORA_CITA = null;
                }
            } else {
                HORA_CITA = null;
            }

            // Insertar en la BD
            await db.promise().query(
                `INSERT INTO CITAS (ATENCION, FECHA_CITA, HORA_CITA, SERVICIO, PROFESIONAL, 
                TIPO_IDE_PACIENTE, NUMERO_IDE, NOMBRE, TELEFONO_FIJO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [ATENCION, FECHA_CITA, HORA_CITA, SERVICIO, PROFESIONAL, TIPO_IDE_PACIENTE, NUMERO_IDE, NOMBRE, TELEFONO_FIJO]
            );
        }

        res.json({ message: "Archivo procesado y datos almacenados correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al procesar el archivo" });
    }
};

module.exports = { upload, procesarExcel };
