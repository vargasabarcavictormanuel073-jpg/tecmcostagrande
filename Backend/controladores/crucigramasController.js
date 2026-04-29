const config     = require("../configuracion/config");
const Usuario    = require("../modelos/Usuario");
const Crucigrama = require("../modelos/Crucigrama");
const { ok, error } = require("../utilidades/respuesta");

async function listar(req, res) {
  try {
    return ok(res, await Crucigrama.listarPorUsuario(req.usuario.id));
  } catch (e) { return error(res, "Error interno", 500); }
}

async function obtener(req, res) {
  try {
    const c = await Crucigrama.findById(req.params.id);
    if (!c) return error(res, "Crucigrama no encontrado", 404);
    if (c.usuario_id !== req.usuario.id) return error(res, "No autorizado", 403);
    return ok(res, c);
  } catch (e) { return error(res, "Error interno", 500); }
}

async function crear(req, res) {
  try {
    const usuario_id = req.usuario.id;
    const total = await Usuario.contarCrucigramas(usuario_id);
    if (total >= config.LIMITE_CRUCIGRAMAS_POR_USUARIO)
      return error(res, `Límite alcanzado: máximo ${config.LIMITE_CRUCIGRAMAS_POR_USUARIO} crucigramas`, 400);

    const { titulo, palabras, grid_data } = req.body;
    if (!Array.isArray(palabras) || palabras.length < 2)
      return error(res, "Se requieren al menos 2 palabras", 422);

    const [id] = await Crucigrama.crear({ usuario_id, titulo, palabras, grid_data });
    return ok(res, { id, titulo, usados: total + 1, restantes: config.LIMITE_CRUCIGRAMAS_POR_USUARIO - total - 1 }, "Crucigrama guardado", 201);
  } catch (e) { return error(res, "Error interno", 500); }
}

async function eliminar(req, res) {
  try {
    const c = await Crucigrama.findById(req.params.id);
    if (!c) return error(res, "Crucigrama no encontrado", 404);
    if (c.usuario_id !== req.usuario.id) return error(res, "No autorizado", 403);
    await Crucigrama.eliminar(req.params.id);
    return ok(res, {}, "Crucigrama eliminado");
  } catch (e) { return error(res, "Error interno", 500); }
}

module.exports = { listar, obtener, crear, eliminar };
