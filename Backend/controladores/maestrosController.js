const Maestro = require("../modelos/Maestro");
const config  = require("../configuracion/config");
const db      = require("../base_de_datos/db");
const { ok, error } = require("../utilidades/respuesta");

async function estadisticas(req, res) {
  try {
    const stats = await Maestro.estadisticas(req.usuario.id);
    return ok(res, {
      ...stats,
      limite_usuarios: config.LIMITE_USUARIOS_POR_MAESTRO,
      usuarios_restantes: config.LIMITE_USUARIOS_POR_MAESTRO - stats.totalUsuarios,
    });
  } catch (e) { return error(res, "Error interno", 500); }
}

// GET /api/maestros/actividades  → todas las sopas y crucigramas de sus usuarios
async function actividades(req, res) {
  try {
    const maestro_id = req.usuario.id;

    const sopas = await db("sopas_letras as sl")
      .join("usuarios as u", "sl.usuario_id", "u.id")
      .where("u.maestro_id", maestro_id)
      .select(
        "sl.id", "sl.titulo", "sl.tamano", "sl.palabras",
        "sl.creado_en", "u.username", "u.nombre as usuario_nombre"
      )
      .orderBy("sl.creado_en", "desc");

    const crucigramas = await db("crucigramas as c")
      .join("usuarios as u", "c.usuario_id", "u.id")
      .where("u.maestro_id", maestro_id)
      .select(
        "c.id", "c.titulo", "c.palabras",
        "c.creado_en", "u.username", "u.nombre as usuario_nombre"
      )
      .orderBy("c.creado_en", "desc");

    return ok(res, {
      sopas: sopas.map(s => ({ ...s, palabras: JSON.parse(s.palabras || "[]") })),
      crucigramas: crucigramas.map(c => ({ ...c, palabras: JSON.parse(c.palabras || "[]") })),
    });
  } catch (e) { return error(res, "Error interno", 500); }
}

module.exports = { estadisticas, actividades };
