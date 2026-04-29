/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: Crucigrama.js
 * DESCRIPCIÓN: Modelo de datos para los crucigramas.
 *              Maneja todas las operaciones de base de datos
 *              sobre la tabla "crucigramas".
 *
 * ESTRUCTURA DE palabras (JSON guardado en BD):
 *   [ { word: "MEXICO", clue: "País de América del Norte" }, ... ]
 *
 * ESTRUCTURA DE grid_data (JSON guardado en BD):
 *   {
 *     grid: [[null,"A","B",...], ...],  ← null = celda negra
 *     placed: [
 *       { word:"MEXICO", clue:"...", startR:2, startC:1,
 *         dir:"across", number:1 }
 *     ],
 *     rows: 10,
 *     cols: 10
 *   }
 * ═══════════════════════════════════════════════════════════════
 */

const db = require("../base_de_datos/db");

const Crucigrama = {

  // Guarda un nuevo crucigrama en la base de datos.
  // palabras y grid_data se serializan a JSON para almacenarse.
  crear: ({ usuario_id, titulo, palabras, grid_data }) =>
    db("crucigramas").insert({
      usuario_id,
      titulo,
      palabras:  JSON.stringify(palabras),             // [{word, clue}] → JSON
      grid_data: grid_data ? JSON.stringify(grid_data) : null,
    }),

  // Lista todos los crucigramas de un usuario, más reciente primero.
  listarPorUsuario: async (usuario_id) => {
    const rows = await db("crucigramas")
      .where({ usuario_id })
      .orderBy("creado_en", "desc");
    return rows.map(parsear);
  },

  // Busca un crucigrama por su ID.
  // Devuelve null si no existe.
  findById: async (id) => {
    const row = await db("crucigramas").where({ id }).first();
    return row ? parsear(row) : null;
  },

  // Elimina un crucigrama por su ID.
  eliminar: (id) => db("crucigramas").where({ id }).delete(),
};

// Convierte los campos JSON almacenados como texto a objetos JS.
function parsear(row) {
  return {
    ...row,
    palabras:  JSON.parse(row.palabras  || "[]"),
    grid_data: row.grid_data ? JSON.parse(row.grid_data) : null,
  };
}

module.exports = Crucigrama;
