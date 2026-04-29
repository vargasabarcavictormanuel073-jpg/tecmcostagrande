/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: Usuario.js
 * DESCRIPCIÓN: Modelo de datos para los usuarios (alumnos).
 *              Contiene todas las operaciones de base de datos
 *              relacionadas con la tabla "usuarios".
 * ═══════════════════════════════════════════════════════════════
 */

const db = require("../base_de_datos/db");

const Usuario = {

  // Busca un usuario por su username (solo activos).
  // Se usa en el login para verificar credenciales.
  findByUsername: (username) =>
    db("usuarios").where({ username, activo: 1 }).first(),

  // Busca un usuario por su ID.
  // No devuelve la contraseña por seguridad.
  findById: (id) =>
    db("usuarios")
      .select("id", "username", "nombre", "email", "maestro_id", "activo", "creado_en")
      .where({ id })
      .first(),

  // Lista todos los usuarios de un maestro con sus contadores
  // de actividades (sopas y crucigramas creados).
  // Se usa en la página de gestión de usuarios del maestro.
  listarPorMaestro: (maestro_id) =>
    db("usuarios as u")
      .where("u.maestro_id", maestro_id)
      .select(
        "u.id", "u.username", "u.nombre", "u.email", "u.activo", "u.creado_en",
        db.raw("(SELECT COUNT(*) FROM sopas_letras WHERE usuario_id = u.id) as sopas"),
        db.raw("(SELECT COUNT(*) FROM crucigramas   WHERE usuario_id = u.id) as crucigramas")
      )
      .orderBy("u.creado_en", "desc"),

  // Crea un nuevo usuario. La contraseña debe venir ya encriptada
  // con bcrypt desde el controlador.
  crear: ({ maestro_id, username, password, nombre, email }) =>
    db("usuarios").insert({ maestro_id, username, password, nombre, email: email || null }),

  // Actualiza los datos básicos de un usuario (nombre, email, estado).
  // No actualiza la contraseña (usa actualizarPassword para eso).
  actualizar: ({ id, nombre, email, activo }) =>
    db("usuarios").where({ id }).update({ nombre, email: email || null, activo }),

  // Actualiza solo la contraseña de un usuario.
  // La contraseña debe venir ya encriptada con bcrypt.
  actualizarPassword: ({ id, password }) =>
    db("usuarios").where({ id }).update({ password }),

  // Elimina un usuario. Al eliminarlo, se borran en cascada
  // todas sus sopas, crucigramas y ahorcados.
  eliminar: (id) =>
    db("usuarios").where({ id }).delete(),

  // Cuenta cuántas sopas ha guardado un usuario.
  // Se usa para verificar si puede crear más (límite en config.js).
  contarSopas: async (usuario_id) => {
    const r = await db("sopas_letras").where({ usuario_id }).count("id as t").first();
    return r.t;
  },

  // Cuenta cuántos crucigramas ha guardado un usuario.
  contarCrucigramas: async (usuario_id) => {
    const r = await db("crucigramas").where({ usuario_id }).count("id as t").first();
    return r.t;
  },

  // Cuenta cuántos ahorcados ha guardado un usuario.
  contarAhorcados: async (usuario_id) => {
    const r = await db("ahorcados").where({ usuario_id }).count("id as t").first();
    return r.t;
  },
};

module.exports = Usuario;
