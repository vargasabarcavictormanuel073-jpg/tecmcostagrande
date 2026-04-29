const config   = require("../configuracion/config");
const Usuario  = require("../modelos/Usuario");
const Ahorcado = require("../modelos/Ahorcado");
const { ok, error } = require("../utilidades/respuesta");

async function listar(req, res) {
  try {
    return ok(res, await Ahorcado.listarPorUsuario(req.usuario.id));
  } catch (e) { return error(res, "Error interno", 500); }
}

async function obtener(req, res) {
  try {
    const item = await Ahorcado.findById(req.params.id);
    if (!item) return error(res, "Ahorcado no encontrado", 404);
    if (item.usuario_id !== req.usuario.id) return error(res, "No autorizado", 403);
    return ok(res, item);
  } catch (e) { return error(res, "Error interno", 500); }
}

// Endpoint público — no requiere auth, solo el id
async function obtenerPublico(req, res) {
  try {
    const item = await Ahorcado.findById(req.params.id);
    if (!item) return error(res, "Ahorcado no encontrado", 404);
    return ok(res, item);
  } catch (e) { return error(res, "Error interno", 500); }
}

async function crear(req, res) {
  try {
    const usuario_id = req.usuario.id;
    const total = await Usuario.contarAhorcados(usuario_id);
    if (total >= config.LIMITE_AHORCADOS_POR_USUARIO)
      return error(res, `Límite alcanzado: máximo ${config.LIMITE_AHORCADOS_POR_USUARIO} ahorcados`, 400);

    const { titulo, palabras } = req.body;
    if (!Array.isArray(palabras) || palabras.length < 1)
      return error(res, "Se requiere al menos una palabra", 422);

    const [id] = await Ahorcado.crear({ usuario_id, titulo, palabras });
    return ok(res, { id, titulo, usados: total + 1, restantes: config.LIMITE_AHORCADOS_POR_USUARIO - total - 1 }, "Ahorcado guardado", 201);
  } catch (e) { return error(res, "Error interno", 500); }
}

async function eliminar(req, res) {
  try {
    const item = await Ahorcado.findById(req.params.id);
    if (!item) return error(res, "Ahorcado no encontrado", 404);
    if (item.usuario_id !== req.usuario.id) return error(res, "No autorizado", 403);
    await Ahorcado.eliminar(req.params.id);
    return ok(res, {}, "Ahorcado eliminado");
  } catch (e) { return error(res, "Error interno", 500); }
}

module.exports = { listar, obtener, obtenerPublico, crear, eliminar };
