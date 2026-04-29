const config  = require("../configuracion/config");
const Usuario = require("../modelos/Usuario");
const Sopa    = require("../modelos/Sopa");
const { ok, error } = require("../utilidades/respuesta");

async function listar(req, res) {
  try {
    return ok(res, await Sopa.listarPorUsuario(req.usuario.id));
  } catch (e) { return error(res, "Error interno", 500); }
}

async function obtener(req, res) {
  try {
    const sopa = await Sopa.findById(req.params.id);
    if (!sopa) return error(res, "Sopa no encontrada", 404);
    if (sopa.usuario_id !== req.usuario.id) return error(res, "No autorizado", 403);
    return ok(res, sopa);
  } catch (e) { return error(res, "Error interno", 500); }
}

async function crear(req, res) {
  try {
    const usuario_id = req.usuario.id;
    const total = await Usuario.contarSopas(usuario_id);
    if (total >= config.LIMITE_SOPAS_POR_USUARIO)
      return error(res, `Límite alcanzado: máximo ${config.LIMITE_SOPAS_POR_USUARIO} sopas`, 400);

    const { titulo, palabras, tamano, direcciones, grid_data } = req.body;
    if (!Array.isArray(palabras) || !palabras.length)
      return error(res, "Se requiere al menos una palabra", 422);

    const [id] = await Sopa.crear({ usuario_id, titulo, palabras, tamano, direcciones, grid_data });
    return ok(res, { id, titulo, usadas: total + 1, restantes: config.LIMITE_SOPAS_POR_USUARIO - total - 1 }, "Sopa guardada", 201);
  } catch (e) { return error(res, "Error interno", 500); }
}

async function eliminar(req, res) {
  try {
    const sopa = await Sopa.findById(req.params.id);
    if (!sopa) return error(res, "Sopa no encontrada", 404);
    if (sopa.usuario_id !== req.usuario.id) return error(res, "No autorizado", 403);
    await Sopa.eliminar(req.params.id);
    return ok(res, {}, "Sopa eliminada");
  } catch (e) { return error(res, "Error interno", 500); }
}

module.exports = { listar, obtener, crear, eliminar };
