const express = require("express");
const router = express.Router();
const user = require("../controllers/users");
const verificarToken = require("../middlewares/auth");
const uploadEscudo = require('../middlewares/uploadEscudo');

router.post("/register", user.registrarUsers);
router.post("/login",user.loginUsers);
router.post("/forgotpassword", user.forgotPassword);
router.get("/alineacion", verificarToken, user.obtenerAlineacion);
router.put("/alineacion", verificarToken, user.guardarAlineacion);
router.put('/perfil', verificarToken, uploadEscudo.single('escudo'), user.actualizarPerfilEquipo);

module.exports = router;