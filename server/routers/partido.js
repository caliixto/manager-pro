const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth");
const partido = require("../controllers/partido");

router.post("/", verificarToken, partido.crearPartido);
router.get("/", verificarToken, partido.listarPartidos);
router.get("/proximo", verificarToken, partido.obtenerProximoPartido);
router.get("/resultados", verificarToken, partido.obtenerUltimosResultados);
router.put("/:id", verificarToken, partido.editarPartido);
router.delete("/:id", verificarToken, partido.eliminarPartido);
router.post("/:id/convocatoria", verificarToken, partido.generarConvocatoria);
router.get("/:id/balance", verificarToken, partido.obtenerBalanceTactico);

module.exports = router;