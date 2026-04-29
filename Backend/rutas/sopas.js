/**
 * Rutas de Sopas de Letras (solo usuarios normales)
 */
const router = require("express").Router();
const { body } = require("express-validator");
const validar = require("../middlewares/validar");
const { verificarToken, soloUsuario } = require("../middlewares/auth");
const ctrl = require("../controladores/sopasController");

const auth = [verificarToken, soloUsuario];

// GET    /api/sopas
router.get("/", auth, ctrl.listar);

// GET    /api/sopas/:id
router.get("/:id", auth, ctrl.obtener);

// POST   /api/sopas
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

// DELETE /api/sopas/:id
router.delete("/:id", auth, ctrl.eliminar);

module.exports = router;
