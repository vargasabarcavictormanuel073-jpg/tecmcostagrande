/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: db.js
 * DESCRIPCIÓN: Conexión singleton a la base de datos SQLite
 *              usando Knex como query builder.
 *              Este archivo exporta una instancia única de la
 *              conexión que usan todos los modelos del sistema.
 * ═══════════════════════════════════════════════════════════════
 *
 * ── QUÉ ES KNEX ─────────────────────────────────────────────────
 *   Knex es un constructor de consultas SQL para Node.js.
 *   Permite escribir consultas de forma segura sin SQL directo.
 *   Documentación: https://knexjs.org
 *
 * ── QUÉ ES SQLITE ───────────────────────────────────────────────
 *   SQLite es una base de datos que se guarda en un solo archivo
 *   (.db). No requiere instalar ningún servidor de base de datos.
 *   El archivo se crea automáticamente en: base_de_datos/edupuzzle.db
 *
 * ── PRAGMA foreign_keys = ON ────────────────────────────────────
 *   Activa las llaves foráneas en SQLite. Sin esto, el CASCADE
 *   (borrado en cascada) no funcionaría al eliminar maestros
 *   o usuarios.
 * ═══════════════════════════════════════════════════════════════
 */

const knex = require("knex");
const path  = require("path");

// Crear la conexión a SQLite
// El archivo .db se crea automáticamente si no existe
const db = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "edupuzzle.db"),
  },
  // Usa NULL como valor por defecto en lugar de undefined
  useNullAsDefault: true,
  pool: {
    // Se ejecuta cada vez que se abre una conexión nueva
    afterCreate: (conn, cb) => {
      // Activar llaves foráneas (necesario para CASCADE)
      conn.run("PRAGMA foreign_keys = ON", cb);
    },
  },
});

module.exports = db;
