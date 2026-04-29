/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: Ahorcado.js
 * DESCRIPCIÓN: Modelo de datos para los juegos de ahorcado.
 *              Maneja todas las operaciones de base de datos
 *              sobre la tabla "ahorcados".
 *
 * ESTRUCTURA DE palabras (JSON guardado en BD):
 *   [
 *     { word: "JAVASCRIPT", pista: "Lenguaje de programación web" },
 *     { word: "INTERNET",   pista: "Red mundial de comunicación" },
 *     ...
 *   ]
 *
 * NOTA: A diferencia de sopas y crucigramas, el ahorcado no
 *       guarda grid_data porque el juego se genera en el frontend
 *       directamente a partir de las palabras y pistas.
 * ═══════════════════════════════════════════════════════════════
 */

const db = require("../base_de_datos/db");

const Ahorcado = {

  // Guarda un nuevo ahorcado en la base de datos.
  // palabras se serializa a JSON para almacenarse.
  crear: ({ usuario_id, titulo, palabras }) =>
    db("ahorcados").insert({
      usuario_id,
      titulo,
      palabras: JSON.stringify(palabras),              // [{word, pista}] → JSON
    }),

  // Lista todos los ahorcados de un usuario, más reciente primero.
  listarPorUsuario: async (usuario_id) => {
    const rows = await db("ahorcados")
      .where({ usuario_id })
      .orderBy("creado_en", "desc");
    return rows.map(parsear);
  },

  // Busca un ahorcado por su ID.
  // Devuelve null si no existe.
  findById: async (id) => {
    const row = await db("ahorcados").where({ id }).first();
    return row ? parsear(row) : null;
  },

  // Elimina un ahorcado por su ID.
  eliminar: (id) => db("ahorcados").where({ id }).delete(),
};

// Convierte el campo palabras de JSON texto a array de objetos JS.
function parsear(row) {
  return {
    ...row,
    palabras: JSON.parse(row.palabras || "[]"),
  };
}

module.exports = Ahorcado;
