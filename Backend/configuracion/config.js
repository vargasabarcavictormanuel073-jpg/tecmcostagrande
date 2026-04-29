/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: config.js
 * DESCRIPCIÓN: Configuración global del sistema EducaTec.
 *              Aquí se definen todos los límites, claves y
 *              parámetros que controlan el comportamiento del
 *              sistema. Es el único lugar donde debes cambiar
 *              estos valores.
 * ═══════════════════════════════════════════════════════════════
 *
 * ── CÓMO AGREGAR UN NUEVO MAESTRO ───────────────────────────────
 *   Los maestros iniciales se crean en:
 *   Backend/base_de_datos/init.js  →  sección "MAESTROS INICIALES"
 *   Agrega un objeto { username, password, nombre } a ese array.
 *
 * ── CÓMO CAMBIAR EL LÍMITE DE USUARIOS POR MAESTRO ──────────────
 *   Cambia el valor de LIMITE_USUARIOS_POR_MAESTRO (actualmente 15).
 *   Ejemplo: para permitir 30 usuarios por maestro pon 30.
 *
 * ── CÓMO CAMBIAR EL LÍMITE DE ACTIVIDADES POR USUARIO ───────────
 *   Cambia LIMITE_SOPAS_POR_USUARIO, LIMITE_CRUCIGRAMAS_POR_USUARIO
 *   o LIMITE_AHORCADOS_POR_USUARIO según necesites.
 *
 * ── CÓMO CAMBIAR EL PUERTO DEL SERVIDOR ─────────────────────────
 *   Cambia PORT (actualmente 5000).
 *   Recuerda actualizar también la URL en frontend/js/app.js
 *   si cambias el puerto.
 * ═══════════════════════════════════════════════════════════════
 */

module.exports = {

  // ── JWT (JSON Web Token) ───────────────────────────────────────
  // En producción (Railway) esta clave viene de la variable de entorno JWT_SECRET.
  // En local usa el valor por defecto si no hay variable definida.
  // ⚠️ En Railway: ve a Variables → agrega JWT_SECRET con un valor secreto largo.
  JWT_SECRET: process.env.JWT_SECRET || "edupuzzle_jwt_secret_tecnm_2026",

  // Tiempo de expiración del token. Formato: "8h", "1d", "30m"
  // Después de este tiempo el usuario debe volver a iniciar sesión.
  JWT_EXPIRES: "8h",

  // ── LÍMITES DEL SISTEMA ────────────────────────────────────────
  // Máximo de usuarios (alumnos) que puede crear cada maestro.
  // ⚠️ Para aumentar el límite, cambia este número.
  LIMITE_USUARIOS_POR_MAESTRO: 15,

  // Máximo de sopas de letras que puede guardar cada usuario.
  LIMITE_SOPAS_POR_USUARIO: 30,

  // Máximo de crucigramas que puede guardar cada usuario.
  LIMITE_CRUCIGRAMAS_POR_USUARIO: 20,

  // Máximo de ahorcados que puede guardar cada usuario.
  LIMITE_AHORCADOS_POR_USUARIO: 20,

  // ── BASE DE DATOS ──────────────────────────────────────────────
  // Ruta del archivo SQLite. Se crea automáticamente si no existe.
  DB_PATH: "./base_de_datos/edupuzzle.db",

  // ── SERVIDOR ──────────────────────────────────────────────────
  // Railway asigna el puerto automáticamente via variable de entorno PORT.
  // En local usa 5000 si no hay variable de entorno definida.
  PORT: process.env.PORT || 5000,

  // Orígenes permitidos para CORS. "*" permite cualquier dominio.
  // En producción reemplaza "*" por tu dominio real.
  CORS_ORIGIN: "*",
};
