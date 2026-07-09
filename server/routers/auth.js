const express = require("express");
const router = express.Router();
const { resetPassword } = require("../controllers/auth");

router.post("/resetpassword", resetPassword);

module.exports = router;