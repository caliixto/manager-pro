const express = require("express");
const router = express.Router();
const player = require("../controllers/player");
const verificarToken  = require ("../middlewares/auth");

router.post("/", verificarToken, player.crearJugador);
router.get("/jugadores", verificarToken, player.listarJugadores);
router.get("/jugadores/:id", verificarToken, player.obtenerJugador);
router.put("/jugadores/:id", verificarToken, player.editarJugador);
router.delete("/jugadores/:id", verificarToken, player.eliminarJugador);

module.exports = router;