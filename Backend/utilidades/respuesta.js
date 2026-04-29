/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: respuesta.js
 * DESCRIPCIÓN: Funciones helper para estandarizar todas las
 *              respuestas JSON de la API.
 *              Todos los endpoints usan estas funciones para
 *              garantizar un formato consistente.
 *
 * FORMATO DE RESPUESTA EXITOSA:
 *   { exito: true, mensaje: "OK", datos: { ... } }
 *
 * FORMATO DE RESPUESTA DE ERROR:
 *   { exito: false, mensaje: "Error...", detalles: null }
 * ═══════════════════════════════════════════════════════════════
 */

// Respuesta exitosa. Status por defecto: 200
// Ejemplo: ok(res, { id: 1, titulo: "Mi sopa" }, "Sopa guardada", 201)
const ok = (res, data = {}, mensaje = "OK", status = 200) =>
  res.status(status).json({ exito: true, mensaje, datos: data });

// Respuesta de error. Status por defecto: 400
// Ejemplo: error(res, "No autorizado", 403)
const error = (res, mensaje = "Error interno", status = 400, detalles = null) =>
  res.status(status).json({ exito: false, mensaje, detalles });

module.exports = { ok, error };
