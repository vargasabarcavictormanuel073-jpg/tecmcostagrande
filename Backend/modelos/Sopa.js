/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: Sopa.js
 * DESCRIPCIÓN: Modelo de datos para las sopas de letras.
 *              Maneja todas las operaciones de base de datos
 *              sobre la tabla "sopas_letras".
 *
 * ESTRUCTURA DE grid_data (JSON guardado en BD):
 *   {
 *     grid: [["A","B",...], ...],   ← Cuadrícula completa con letras
 *     placed: [                     ← Palabras colocadas
 *       { word: "PERRO", cells: [{r:0,c:0},{r:0,c:1},...] }
 *     ]
 *   }
 * ═══════════════════════════════════════════════════════════════
 */

const db = require("../base_de_datos/db");

const Sopa = {

  // Guarda una nueva sopa en la base de datos.
  // palabras y grid_data se serializan a JSON para almacenarse.
  crear: ({ usuario_id, titulo, palabras, tamano, direcciones, grid_data }) =>
    db("sopas_letras").insert({
      usuario_id,
      titulo,
      palabras:    JSON.stringify(palabras),           // Array de strings → JSON
      tamano:      tamano || 15,                       // Tamaño por defecto: 15×15
      direcciones: direcciones || "all",               // Direcciones por defecto: todas
      grid_data:   grid_data ? JSON.stringify(grid_data) : null,
    }),

  // Lista todas las sopas de un usuario, ordenadas por más reciente.
  // Convierte los campos JSON de vuelta a objetos JavaScript.
  listarPorUsuario: async (usuario_id) => {
    const rows = await db("sopas_letras")
      .where({ usuario_id })
      .orderBy("creado_en", "desc");
    return rows.map(parsear);
  },

  // Busca una sopa por su ID.
  // Devuelve null si no existe.
  findById: async (id) => {
    const row = await db("sopas_letras").where({ id }).first();
    return row ? parsear(row) : null;
  },

  // Elimina una sopa por su ID.
  eliminar: (id) => db("sopas_letras").where({ id }).delete(),
};

// Convierte los campos JSON almacenados como texto a objetos JS.
// Se aplica a cada fila que viene de la base de datos.
function parsear(row) {
  return {
    ...row,
    palabras:  JSON.parse(row.palabras  || "[]"),
    grid_data: row.grid_data ? JSON.parse(row.grid_data) : null,
  };
}

module.exports = Sopa;
