/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: usuariosController.js
 * DESCRIPCIÓN: Controlador para la gestión de usuarios (alumnos).
 *              Solo los maestros pueden usar estos endpoints.
 *              Cada maestro solo puede ver y gestionar sus
 *              propios usuarios.
 *
 * ENDPOINTS:
 *   GET    /api/usuarios              → listar()
 *   GET    /api/usuarios/:id          → obtener()
 *   GET    /api/usuarios/:id/estadisticas → estadisticas()
 *   POST   /api/usuarios              → crear()
 *   PUT    /api/usuarios/:id          → actualizar()
 *   DELETE /api/usuarios/:id          → eliminar()
 * ═══════════════════════════════════════════════════════════════
 */

const bcrypt  = require("bcryptjs");
const config  = require("../configuracion/config");
const Maestro = require("../modelos/Maestro");
const Usuario = require("../modelos/Usuario");
const { ok, error } = require("../utilidades/respuesta");

// Lista todos los usuarios del maestro autenticado.
// Incluye contadores de sopas y crucigramas por usuario.
async function listar(req, res) {
  try {
    const usuarios = await Usuario.listarPorMaestro(req.usuario.id);
    return ok(res, usuarios);
  } catch (e) { return error(res, "Error interno", 500); }
}

// Obtiene un usuario específico por ID.
// Verifica que el usuario pertenezca al maestro autenticado.
async function obtener(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return error(res, "Usuario no encontrado", 404);
    if (usuario.maestro_id !== req.usuario.id) return error(res, "No autorizado", 403);
    return ok(res, usuario);
  } catch (e) { return error(res, "Error interno", 500); }
}

// Crea un nuevo usuario (alumno) para el maestro autenticado.
// Verifica que no se haya alcanzado el límite de usuarios.
// El límite se configura en: configuracion/config.js → LIMITE_USUARIOS_POR_MAESTRO
// La contraseña se encripta con bcrypt antes de guardarla.
async function crear(req, res) {
  try {
    const maestro_id = req.usuario.id;

    // Verificar límite de usuarios
    const total = await Maestro.contarUsuarios(maestro_id);
    if (total >= config.LIMITE_USUARIOS_POR_MAESTRO)
      return error(res, `Límite alcanzado: máximo ${config.LIMITE_USUARIOS_POR_MAESTRO} usuarios`, 400);

    const { username, password, nombre, email } = req.body;

    // Verificar que el username no esté en uso
    const existe = await Usuario.findByUsername(username);
    if (existe) return error(res, "El nombre de usuario ya existe", 409);

    // Encriptar contraseña antes de guardar
    const hash = bcrypt.hashSync(password, 10);
    const [id] = await Usuario.crear({ maestro_id, username, password: hash, nombre, email });

    return ok(res, { id, username, nombre }, "Usuario creado correctamente", 201);
  } catch (e) { return error(res, "Error interno", 500); }
}

// Actualiza los datos de un usuario (nombre, email, estado activo/inactivo).
// Si se envía una nueva contraseña (mínimo 4 caracteres), también la actualiza.
// Verifica que el usuario pertenezca al maestro autenticado.
async function actualizar(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return error(res, "Usuario no encontrado", 404);
    if (usuario.maestro_id !== req.usuario.id) return error(res, "No autorizado", 403);

    const { nombre, email, activo, password } = req.body;
    await Usuario.actualizar({
      id:     req.params.id,
      nombre: nombre ?? usuario.nombre,
      email:  email  ?? usuario.email,
      activo: activo ?? 1,
    });

    // Actualizar contraseña solo si se envió una nueva (mínimo 4 caracteres)
    if (password?.trim().length >= 4) {
      await Usuario.actualizarPassword({
        id: req.params.id,
        password: bcrypt.hashSync(password, 10),
      });
    }

    return ok(res, {}, "Usuario actualizado correctamente");
  } catch (e) { return error(res, "Error interno", 500); }
}

// Elimina un usuario y todas sus actividades (cascada en BD).
// Verifica que el usuario pertenezca al maestro autenticado.
async function eliminar(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return error(res, "Usuario no encontrado", 404);
    if (usuario.maestro_id !== req.usuario.id) return error(res, "No autorizado", 403);
    await Usuario.eliminar(req.params.id);
    return ok(res, {}, "Usuario eliminado correctamente");
  } catch (e) { return error(res, "Error interno", 500); }
}

// Devuelve estadísticas de un usuario específico:
// cuántas sopas, crucigramas y cuántos le quedan disponibles.
async function estadisticas(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return error(res, "Usuario no encontrado", 404);
    if (usuario.maestro_id !== req.usuario.id) return error(res, "No autorizado", 403);

    const sopas       = await Usuario.contarSopas(req.params.id);
    const crucigramas = await Usuario.contarCrucigramas(req.params.id);

    return ok(res, {
      usuario,
      sopas_usadas:          sopas,
      sopas_restantes:       config.LIMITE_SOPAS_POR_USUARIO       - sopas,
      crucigramas_usados:    crucigramas,
      crucigramas_restantes: config.LIMITE_CRUCIGRAMAS_POR_USUARIO - crucigramas,
    });
  } catch (e) { return error(res, "Error interno", 500); }
}

module.exports = { listar, obtener, crear, actualizar, eliminar, estadisticas };
