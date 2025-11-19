#!/usr/bin/env node

/**
 * Script de Verificación del Sistema de Cancelación de Citas
 *
 * Ejecutar: node scripts/verificar_sistema.js
 */

const db = require('../config/db');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`)
};

async function verificarVariablesEntorno() {
  log.header('1. VERIFICANDO VARIABLES DE ENTORNO');

  const requeridas = ['META_TOKEN', 'META_PHONE_NUMBER_ID', 'META_WA_BASE_URL'];
  const opcionales = ['META_VERIFY_TOKEN'];

  let todoBien = true;

  requeridas.forEach(variable => {
    if (process.env[variable]) {
      log.success(`${variable} está configurada`);
    } else {
      log.error(`${variable} NO está configurada`);
      todoBien = false;
    }
  });

  opcionales.forEach(variable => {
    if (process.env[variable]) {
      log.success(`${variable} está configurada`);
    } else {
      log.warning(`${variable} no está configurada (opcional, pero recomendada para webhook)`);
    }
  });

  return todoBien;
}

async function verificarBaseDatos() {
  log.header('2. VERIFICANDO BASE DE DATOS');

  try {
    // Verificar tabla citas
    const [citasColumns] = await db.query(
      "SHOW COLUMNS FROM citas LIKE '%CANCEL%' OR SHOW COLUMNS FROM citas LIKE 'ESTADO'"
    );

    log.info('Verificando campos de cancelación en tabla citas...');

    const [camposCancelacion] = await db.query(
      "SHOW COLUMNS FROM citas WHERE Field IN ('MOTIVO_CANCELACION', 'FECHA_CANCELACION', 'CANCELADO_POR')"
    );

    if (camposCancelacion.length >= 3) {
      log.success('Campos de cancelación existen en tabla citas');
      camposCancelacion.forEach(campo => {
        log.info(`  - ${campo.Field} (${campo.Type})`);
      });
    } else {
      log.error('Faltan campos de cancelación en tabla citas');
      log.warning('Ejecuta: mysql -u usuario -p database < backend/migrations/001_add_cancellation_fields.sql');
      return false;
    }

    // Verificar tabla whatsapp_conversaciones
    const [conversacionesTable] = await db.query(
      "SHOW TABLES LIKE 'whatsapp_conversaciones'"
    );

    if (conversacionesTable.length > 0) {
      log.success('Tabla whatsapp_conversaciones existe');

      const [count] = await db.query('SELECT COUNT(*) as count FROM whatsapp_conversaciones');
      log.info(`  - ${count[0].count} conversaciones registradas`);
    } else {
      log.error('Tabla whatsapp_conversaciones NO existe');
      log.warning('Ejecuta: mysql -u usuario -p database < backend/migrations/001_add_cancellation_fields.sql');
      return false;
    }

    return true;
  } catch (error) {
    log.error(`Error verificando base de datos: ${error.message}`);
    return false;
  }
}

async function verificarCitasPrueba() {
  log.header('3. VERIFICANDO CITAS DE PRUEBA');

  try {
    const [citasPrueba] = await db.query(
      "SELECT COUNT(*) as count FROM citas WHERE NOMBRE LIKE '%[PRUEBA]%'"
    );

    if (citasPrueba[0].count > 0) {
      log.success(`${citasPrueba[0].count} citas de prueba encontradas`);

      const [citas] = await db.query(
        `SELECT ID, NOMBRE, DATE_FORMAT(FECHA_CITA, '%Y-%m-%d') as fecha,
         TIME_FORMAT(HORA_CITA, '%H:%i') as hora, SERVICIO, ESTADO
         FROM citas
         WHERE NOMBRE LIKE '%[PRUEBA]%'
         LIMIT 5`
      );

      console.log('\nPrimeras 5 citas de prueba:');
      citas.forEach(cita => {
        console.log(`  - ID ${cita.ID}: ${cita.NOMBRE} - ${cita.fecha} ${cita.hora} (${cita.ESTADO})`);
      });
    } else {
      log.warning('No hay citas de prueba');
      log.info('Carga datos de prueba con:');
      log.info('  mysql -u usuario -p database < backend/seeders/test_appointments_seeder.sql');
    }

    // Verificar citas para mañana
    const [citasManana] = await db.query(
      `SELECT COUNT(*) as count FROM citas
       WHERE DATE(FECHA_CITA) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
       AND ESTADO = 'pendiente'`
    );

    if (citasManana[0].count > 0) {
      log.success(`${citasManana[0].count} citas programadas para mañana`);
    } else {
      log.warning('No hay citas programadas para mañana');
      log.info('El sistema envía recordatorios solo para citas de mañana');
    }

    return true;
  } catch (error) {
    log.error(`Error verificando citas: ${error.message}`);
    return false;
  }
}

async function verificarEstadisticas() {
  log.header('4. ESTADÍSTICAS DEL SISTEMA');

  try {
    const [stats] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM citas) as total_citas,
        (SELECT COUNT(*) FROM citas WHERE ESTADO = 'pendiente') as pendientes,
        (SELECT COUNT(*) FROM citas WHERE ESTADO = 'recordatorio enviado') as recordatorios_enviados,
        (SELECT COUNT(*) FROM citas WHERE ESTADO = 'cancelada') as canceladas,
        (SELECT COUNT(*) FROM whatsapp_conversaciones) as conversaciones,
        (SELECT COUNT(*) FROM whatsapp_conversaciones WHERE estado_conversacion = 'completada') as conversaciones_completadas
    `);

    const s = stats[0];

    console.log('Citas:');
    log.info(`  Total: ${s.total_citas}`);
    log.info(`  Pendientes: ${s.pendientes}`);
    log.info(`  Recordatorios enviados: ${s.recordatorios_enviados}`);
    log.info(`  Canceladas: ${s.canceladas}`);

    console.log('\nConversaciones de WhatsApp:');
    log.info(`  Total: ${s.conversaciones}`);
    log.info(`  Completadas: ${s.conversaciones_completadas}`);

    if (s.canceladas > 0) {
      const [cancelaciones] = await db.query(`
        SELECT
          NOMBRE,
          SERVICIO,
          DATE_FORMAT(FECHA_CANCELACION, '%Y-%m-%d %H:%i') as fecha_cancelacion,
          MOTIVO_CANCELACION,
          CANCELADO_POR
        FROM citas
        WHERE ESTADO = 'cancelada'
        ORDER BY FECHA_CANCELACION DESC
        LIMIT 3
      `);

      console.log('\nÚltimas 3 cancelaciones:');
      cancelaciones.forEach((c, i) => {
        console.log(`\n${i + 1}. ${c.NOMBRE}`);
        log.info(`   Servicio: ${c.SERVICIO}`);
        log.info(`   Fecha cancelación: ${c.fecha_cancelacion}`);
        log.info(`   Motivo: ${c.MOTIVO_CANCELACION || 'N/A'}`);
        log.info(`   Cancelado por: ${c.CANCELADO_POR || 'N/A'}`);
      });
    }

    return true;
  } catch (error) {
    log.error(`Error obteniendo estadísticas: ${error.message}`);
    return false;
  }
}

async function verificarEndpoints() {
  log.header('5. ENDPOINTS DISPONIBLES');

  log.info('Endpoints de WhatsApp:');
  console.log('  GET  /api/whatsapp/enviar-recordatorios - Enviar recordatorios');
  console.log('  GET  /api/whatsapp/webhook - Verificación de webhook Meta');
  console.log('  POST /api/whatsapp/webhook - Recibir mensajes de Meta');
  console.log('  GET  /api/whatsapp/respuestas - Ver respuestas (legacy)');

  log.info('\nEndpoints de Dashboard:');
  console.log('  GET  /api/dashboard/stats - Estadísticas y cancelaciones');

  log.warning('\nPara probar los endpoints, ejecuta:');
  console.log('  curl http://localhost:5000/api/dashboard/stats');

  return true;
}

async function main() {
  console.log('\n');
  log.header('VERIFICACIÓN DEL SISTEMA DE CANCELACIÓN DE CITAS');

  const resultados = {
    env: await verificarVariablesEntorno(),
    db: await verificarBaseDatos(),
    citas: await verificarCitasPrueba(),
    stats: await verificarEstadisticas(),
    endpoints: await verificarEndpoints()
  };

  log.header('RESUMEN');

  const total = Object.keys(resultados).length;
  const exitosos = Object.values(resultados).filter(r => r === true).length;

  console.log(`\nVerificaciones completadas: ${exitosos}/${total}\n`);

  Object.entries(resultados).forEach(([key, value]) => {
    const emoji = value ? '✅' : '❌';
    const nombre = {
      env: 'Variables de entorno',
      db: 'Base de datos',
      citas: 'Citas de prueba',
      stats: 'Estadísticas',
      endpoints: 'Endpoints'
    }[key];

    console.log(`${emoji} ${nombre}`);
  });

  console.log('\n');

  if (exitosos === total) {
    log.success('¡TODO ESTÁ LISTO! El sistema está correctamente configurado.');
    log.info('\nPróximos pasos:');
    console.log('  1. Configurar webhook en Meta WhatsApp Business');
    console.log('  2. Ejecutar: node server.js (o npm start)');
    console.log('  3. Enviar recordatorios de prueba');
  } else {
    log.error('Hay problemas que necesitan resolverse.');
    log.info('Revisa los mensajes de error arriba y sigue las instrucciones.');
  }

  await db.end();
  process.exit(exitosos === total ? 0 : 1);
}

// Manejo de errores
process.on('unhandledRejection', (error) => {
  log.error(`Error no manejado: ${error.message}`);
  process.exit(1);
});

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { verificarVariablesEntorno, verificarBaseDatos, verificarCitasPrueba };
