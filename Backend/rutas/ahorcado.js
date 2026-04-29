/**
 * Rutas de Ahorcado (solo usuarios normales)
 */
const router = require("express").Router();
const { body } = require("express-validator");
const validar = require("../middlewares/validar");
const { verificarToken, soloUsuario } = require("../middlewares/auth");
const ctrl = require("../controladores/ahorcadoController");

const auth = [verificarToken, soloUsuario];

// GET  /api/ahorcado              — listar los del usuario
router.get("/", auth, ctrl.listar);

// GET  /api/ahorcado/publico/:id  — visor público sin auth (para iframe)
router.get("/publico/:id", ctrl.obtenerPublico);

// GET  /api/ahorcado/:id          — obtener uno (autenticado)
router.get("/:id", auth, ctrl.obtener);

// POST /api/ahorcado
router.post(
  "/",
  [
    ...auth,
    body("titulo").trim().notEmpty().withMessage("Título requerido"),
    body("palabras").isArray({ min: 1 }).withMessage("Se requiere al menos una palabra"),
  ],
  validar,
  ctrl.crear
);

// DELETE /api/ahorcado/:id
router.delete("/:id", auth, ctrl.eliminar);

module.exports = router;
