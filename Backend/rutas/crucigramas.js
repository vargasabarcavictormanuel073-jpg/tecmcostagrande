/**
 * Rutas de Crucigramas (solo usuarios normales)
 */
const router = require("express").Router();
const { body } = require("express-validator");
const validar = require("../middlewares/validar");
const { verificarToken, soloUsuario } = require("../middlewares/auth");
const ctrl = require("../controladores/crucigramasController");

const auth = [verificarToken, soloUsuario];

// GET    /api/crucigramas
router.get("/", auth, ctrl.listar);

// GET    /api/crucigramas/:id
router.get("/:id", auth, ctrl.obtener);

// POST   /api/crucigramas
router.post(
  "/",
  [
    ...auth,
    body("titulo").trim().notEmpty().withMessage("Título requerido"),
    body("palabras").isArray({ min: 2 }).withMessage("Se requieren al menos 2 palabras"),
  ],
  validar,
  ctrl.crear
);

// DELETE /api/crucigramas/:id
router.delete("/:id", auth, ctrl.eliminar);

module.exports = router;
