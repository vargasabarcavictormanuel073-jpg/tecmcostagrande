/**
 * Rutas de autenticación
 */
const router = require("express").Router();
const { body } = require("express-validator");
const validar = require("../middlewares/validar");
const { verificarToken } = require("../middlewares/auth");
const ctrl = require("../controladores/authController");

// POST /api/auth/login-maestro
router.post(
  "/login-maestro",
  [
    body("username").trim().notEmpty().withMessage("Username requerido"),
    body("password").notEmpty().withMessage("Password requerido"),
  ],
  validar,
  ctrl.loginMaestro
);

// POST /api/auth/login-usuario
router.post(
  "/login-usuario",
  [
    body("username").trim().notEmpty().withMessage("Username requerido"),
    body("password").notEmpty().withMessage("Password requerido"),
  ],
  validar,
  ctrl.loginUsuario
);

// GET /api/auth/perfil  (requiere token)
router.get("/perfil", verificarToken, ctrl.perfil);

module.exports = router;
