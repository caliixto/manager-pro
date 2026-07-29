const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth");
const participacion = require("../controllers/participacion");

router.get("/jugador/:jugadorId", verificarToken, participacion.obtenerEstadisticasJugador);
router.post("/", verificarToken, participacion.registrarParticipacion);

module.exports = router;