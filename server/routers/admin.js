const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");




// La ruta es '/register' y el controlador es 'admin.registrarUsuario'
router.post("/register", admin.registrarAdmin);
router.post("/login",admin.loginAdmin);

module.exports = router;
