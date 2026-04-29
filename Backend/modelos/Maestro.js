/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: Maestro.js
 * DESCRIPCIÓN: Modelo de datos para los maestros.
 *              Contiene todas las operaciones de base de datos
 *              relacionadas con la tabla "maestros".
 * ═══════════════════════════════════════════════════════════════
 */

const db = require("../base_de_datos/db");

const Maestro = {

  // Busca un maestro por su username (solo activos).
  // Se usa en el login para verificar credenciales.
  findByUsername: (username) =>
    db("maestros").where({ username, activo: 1 }).first(),

  // Busca un maestro por su ID.
  // No devuelve la contraseña por seguridad.
  findById: (id) =>
    db("maestros")
      .select("id", "username", "nombre", "email", "creado_en")
      .where({ id })
      .first(),

  // Cuenta cuántos usuarios (alumnos) tiene un maestro.
  // Se usa para verificar si puede crear más usuarios.
  contarUsuarios: async (maestro_id) => {
    const r = await db("usuarios")
      .where({ maestro_id })
      .count("id as total")
      .first();
    return r.total;
  },

  // Obtiene estadísticas completas del maestro para el dashboard:
  // - totalUsuarios: cuántos alumnos ha creado
  // - totalSopas: cuántas sopas han creado sus alumnos
  // - totalCrucigramas: cuántos crucigramas han creado sus alumnos
  estadisticas: async (maestro_id) => {
    const [{ total: totalUsuarios }] = await db("usuarios")
      .where({ maestro_id })
      .count("id as total");

    const [{ total: totalSopas }] = await db("sopas_letras as sl")
      .join("usuarios as u", "sl.usuario_id", "u.id")
      .where("u.maestro_id", maestro_id)
      .count("sl.id as total");

    const [{ total: totalCrucigramas }] = await db("crucigramas as c")
      .join("usuarios as u", "c.usuario_id", "u.id")
      .where("u.maestro_id", maestro_id)
      .count("c.id as total");

    return { totalUsuarios, totalSopas, totalCrucigramas };
  },
};

module.exports = Maestro;
