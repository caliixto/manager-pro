const { confirmarResetPasswordGlobal } = require("../utils/passwordReset");

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const resultado = await confirmarResetPasswordGlobal(token, newPassword);

    if (!resultado) {
      return res.status(400).json({ status: "error", message: "El enlace no es válido o ha caducado" });
    }

    return res.json({ status: "success", mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

module.exports = { resetPassword };