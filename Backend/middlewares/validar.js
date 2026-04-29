/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: validar.js (middleware)
 * DESCRIPCIÓN: Middleware que revisa los errores de validación
 *              generados por express-validator en las rutas.
 *              Si hay errores de validación, responde con 422
 *              y la lista de errores. Si no hay errores, continúa.
 *
 * USO EN RUTAS:
 *   router.post("/ruta", [
 *     body("campo").notEmpty().withMessage("Campo requerido"),
 *   ], validar, ctrl.funcion)
 * ═══════════════════════════════════════════════════════════════
 */

const { validationResult } = require("express-validator");
const { error } = require("../utilidades/respuesta");

function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    // Responde con 422 Unprocessable Entity y la lista de errores
    return error(res, "Datos inválidos", 422, errores.array());
  }
  next(); // Sin errores, continúa al controlador
}

module.exports = validar;
