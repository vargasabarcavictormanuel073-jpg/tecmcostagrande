/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: auth.js (middleware)
 * DESCRIPCIÓN: Middlewares de autenticación y autorización.
 *              Se usan en las rutas para proteger endpoints.
 *              Un middleware es una función que se ejecuta
 *              antes del controlador final.
 *
 * USO EN RUTAS:
 *   router.get("/ruta", [verificarToken, soloMaestro], ctrl.funcion)
 *   router.get("/ruta", [verificarToken, soloUsuario], ctrl.funcion)
 * ═══════════════════════════════════════════════════════════════
 */

const jwt    = require("jsonwebtoken");
const config = require("../configuracion/config");
const { error } = require("../utilidades/respuesta");

// Verifica que el request tenga un token JWT válido.
// El token debe venir en el header: Authorization: Bearer <token>
// Si es válido, agrega req.usuario con los datos del token.
// Si no es válido o expiró, responde con error 401.
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extrae el token del "Bearer <token>"

  if (!token) return error(res, "Token requerido", 401);

  try {
    // Verifica la firma y expiración del token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.usuario = decoded; // Agrega {id, username, nombre, rol} al request
    next();                // Continúa al siguiente middleware o controlador
  } catch (e) {
    return error(res, "Token inválido o expirado", 401);
  }
}

// Permite el acceso solo a maestros.
// Debe usarse después de verificarToken.
function soloMaestro(req, res, next) {
  if (req.usuario?.rol !== "maestro")
    return error(res, "Acceso restringido a maestros", 403);
  next();
}

// Permite el acceso solo a usuarios normales (alumnos).
// Debe usarse después de verificarToken.
function soloUsuario(req, res, next) {
  if (req.usuario?.rol !== "usuario")
    return error(res, "Acceso restringido a usuarios", 403);
  next();
}

module.exports = { verificarToken, soloMaestro, soloUsuario };
