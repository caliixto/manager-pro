const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { enviarEmailRecuperacion } = require("./mailter");
const Admin = require("../models/admin");
const Users = require("../models/users");

const solicitarResetPassword = async (Modelo, email) => {
  const encontrado = await Modelo.findOne({ email });
  if (!encontrado) return;

  const token = crypto.randomBytes(32).toString("hex");
  encontrado.resetPasswordToken = token;
  encontrado.resetPasswordExpires = Date.now() + 3600000;
  await encontrado.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await enviarEmailRecuperacion(encontrado.email, resetLink);
};

const confirmarResetPasswordGlobal = async (token, newPassword) => {
  // Prueba primero en Admin
  let encontrado = await Admin.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  let esAdmin = true;

  // Si no está en Admin, prueba en Users
  if (!encontrado) {
    encontrado = await Users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    esAdmin = false;
  }

  if (!encontrado) return null;

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  encontrado.password = hashedPassword;
  encontrado.resetPasswordToken = undefined;
  encontrado.resetPasswordExpires = undefined;
  await encontrado.save();

  return { encontrado, esAdmin };
};

module.exports = { solicitarResetPassword, confirmarResetPasswordGlobal };