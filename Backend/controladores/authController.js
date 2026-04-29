/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: authController.js
 * DESCRIPCIÓN: Controlador de autenticación.
 *              Maneja el login de maestros y usuarios, y la
 *              consulta del perfil del usuario autenticado.
 *
 * ENDPOINTS:
 *   POST /api/auth/login-maestro  → loginMaestro()
 *   POST /api/auth/login-usuario  → loginUsuario()
 *   GET  /api/auth/perfil         → perfil()
 * ═══════════════════════════════════════════════════════════════
 */

const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const config = require("../configuracion/config");
const Maestro  = require("../modelos/Maestro");
const Usuario  = require("../modelos/Usuario");
const db       = require("../base_de_datos/db");
const { ok, error } = require("../utilidades/respuesta");

// Login para maestros.
// Verifica username y contraseña, genera un JWT con rol "maestro".
// Registra la sesión en la tabla sesiones.
async function loginMaestro(req, res) {
  try {
    const { username, password } = req.body;

    // Busca el maestro y verifica la contraseña con bcrypt
    const maestro = await Maestro.findByUsername(username);
    if (!maestro || !bcrypt.compareSync(password, maestro.password))
      return error(res, "Credenciales incorrectas", 401);

    // Registra el inicio de sesión
    await db("sesiones").insert({ tipo: "maestro", ref_id: maestro.id, ip: req.ip });

    // Genera el token JWT con los datos del maestro
    const token = jwt.sign(
      { id: maestro.id, username: maestro.username, nombre: maestro.nombre, rol: "maestro" },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES }
    );

    return ok(res, { token, rol: "maestro", nombre: maestro.nombre, id: maestro.id }, "Login exitoso");
  } catch (e) { return error(res, "Error interno", 500); }
}

// Login para usuarios normales (alumnos).
// Verifica username y contraseña, genera un JWT con rol "usuario".
// Registra la sesión en la tabla sesiones.
async function loginUsuario(req, res) {
  try {
    const { username, password } = req.body;

    // Busca el usuario y verifica la contraseña con bcrypt
    const usuario = await Usuario.findByUsername(username);
    if (!usuario || !bcrypt.compareSync(password, usuario.password))
      return error(res, "Credenciales incorrectas", 401);

    // Registra el inicio de sesión
    await db("sesiones").insert({ tipo: "usuario", ref_id: usuario.id, ip: req.ip });

    // Genera el token JWT con los datos del usuario
    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, nombre: usuario.nombre, rol: "usuario", maestro_id: usuario.maestro_id },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES }
    );

    return ok(res, { token, rol: "usuario", nombre: usuario.nombre, id: usuario.id }, "Login exitoso");
  } catch (e) { return error(res, "Error interno", 500); }
}

// Devuelve el perfil del usuario autenticado.
// Para maestros: datos + estadísticas del dashboard.
// Para usuarios: datos + contadores de actividades creadas.
async function perfil(req, res) {
  try {
    const { rol, id } = req.usuario;

    if (rol === "maestro") {
      const m     = await Maestro.findById(id);
      const stats = await Maestro.estadisticas(id);
      return ok(res, { ...m, rol, ...stats });
    } else {
      const u           = await Usuario.findById(id);
      const sopas       = await Usuario.contarSopas(id);
      const crucigramas = await Usuario.contarCrucigramas(id);
      const ahorcados   = await Usuario.contarAhorcados(id);
      return ok(res, {
        ...u, rol,
        sopas_usadas:           sopas,
        crucigramas_usados:     crucigramas,
        ahorcados_usados:       ahorcados,
        sopas_restantes:        config.LIMITE_SOPAS_POR_USUARIO        - sopas,
        crucigramas_restantes:  config.LIMITE_CRUCIGRAMAS_POR_USUARIO  - crucigramas,
        ahorcados_restantes:    config.LIMITE_AHORCADOS_POR_USUARIO    - ahorcados,
      });
    }
  } catch (e) { return error(res, "Error interno", 500); }
}

module.exports = { loginMaestro, loginUsuario, perfil };
