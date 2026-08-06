// routes/partido.routes.js
const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth");
const partido = require("../controllers/partido");
const { calcularClasificacionLiga } = require('../utils/calcularClasificacion'); // 👈 nuevo import

router.get("/", verificarToken, partido.listarPartidos);
router.get("/proximo", verificarToken, partido.obtenerProximoPartido);
router.get("/resultados", verificarToken, partido.obtenerUltimosResultados);
router.get("/liga/clasificacion", verificarToken, async (req, res) => {  // 👈 nueva ruta aquí
  try {
    const clasificacion = await calcularClasificacionLiga(req.user.id);
    return res.json({ status: 'success', clasificacion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Error al calcular la clasificación' });
  }
});
router.put("/:id", verificarToken, partido.editarPartido);
router.delete("/:id", verificarToken, partido.eliminarPartido);
router.post("/:id/convocatoria", verificarToken, partido.generarConvocatoria);
router.get("/:id/balance", verificarToken, partido.obtenerBalanceTactico);
router.get("/:id/titulares", verificarToken, partido.obtenerTitulares);
router.get("/:id/convocatoria-detalle", verificarToken, partido.obtenerConvocatoriaDetallada);
router.post('/partidos/simular', verificarToken, partido.simularPartido);

module.exports = router;