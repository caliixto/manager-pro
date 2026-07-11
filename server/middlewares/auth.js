const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ status: "error", message: "No se proporcionó token" });
    }

    // El header suele venir como "Bearer eyJhbGc..."
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ status: "error", message: "Token no válido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // aquí queda disponible { id, email } en cualquier controlador siguiente

    next(); // deja pasar la petición al controlador
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Token inválido o caducado" });
  }
};

module.exports = verificarToken;