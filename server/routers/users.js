const express = require("express");
const router = express.Router();
const user = require("../controllers/users");

// La ruta es '/register' y el controlador es 'admin.registrarUsuario'
router.post("/register", user.registrarUsers);
router.post("/login",user.loginUsers);
router.post("/forgotpassword", user.forgotPassword);

module.exports = router;