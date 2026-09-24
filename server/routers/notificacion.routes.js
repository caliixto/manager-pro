const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/auth");
const notificacion = require("../controllers/notificacion");

router.get("/", verificarToken, notificacion.obtenerNotificaciones);
router.post("/reclamar-todas", verificarToken, notificacion.reclamarTodas);

module.exports = router;