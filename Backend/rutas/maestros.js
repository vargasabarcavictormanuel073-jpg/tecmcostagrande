/**
 * Rutas de Maestros
 */
const router = require("express").Router();
const { verificarToken, soloMaestro } = require("../middlewares/auth");
const ctrl = require("../controladores/maestrosController");

// GET /api/maestros/estadisticas
router.get("/estadisticas", [verificarToken, soloMaestro], ctrl.estadisticas);

// GET /api/maestros/actividades
router.get("/actividades", [verificarToken, soloMaestro], ctrl.actividades);

module.exports = router;
