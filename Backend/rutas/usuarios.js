/**
 * ═══════════════════════════════════════════════════════════════
 * ARCHIVO: rutas/usuarios.js
 * DESCRIPCIÓN: Define las rutas HTTP para la gestión de usuarios.
 *              Todos los endpoints requieren autenticación de
 *              maestro (verificarToken + soloMaestro).
 *
 * BASE URL: /api/usuarios
 * ═══════════════════════════════════════════════════════════════
 */

const router = require("express").Router();
const { body } = require("express-validator");
const validar = require("../middlewares/validar");
const { verificarToken, soloMaestro } = require("../middlewares/auth");
const ctrl = require("../controladores/usuariosController");

// Shortcut: ambos middlewares de autenticación juntos
const auth = [verificarToken, soloMaestro];

// GET /api/usuarios — Lista todos los usuarios del maestro autenticado
router.get("/", auth, ctrl.listar);

// GET /api/usuarios/:id — Obtiene un usuario específico
router.get("/:id", auth, ctrl.obtener);

// GET /api/usuarios/:id/estadisticas — Estadísticas de actividades del usuario
router.get("/:id/estadisticas", auth, ctrl.estadisticas);

// POST /api/usuarios — Crea un nuevo usuario (alumno)
// Valida: username mínimo 3 chars, password mínimo 4 chars, nombre requerido
router.post(
  "/",
  [
    ...auth,
    body("username").trim().isLength({ min: 3 }).withMessage("Username mínimo 3 caracteres"),
    body("password").isLength({ min: 4 }).withMessage("Password mínimo 4 caracteres"),
    body("nombre").trim().notEmpty().withMessage("Nombre requerido"),
  ],
  validar,
  ctrl.crear
);

// PUT /api/usuarios/:id — Actualiza datos de un usuario
// nombre es opcional en la actualización
router.put(
  "/:id",
  [
    ...auth,
    body("nombre").optional().trim().notEmpty(),
  ],
  validar,
  ctrl.actualizar
);

// DELETE /api/usuarios/:id — Elimina un usuario y todas sus actividades
router.delete("/:id", auth, ctrl.eliminar);

module.exports = router;
