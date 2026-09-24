const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificacionSchema = new Schema({
  equipo: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  tipo: { type: String, default: 'premio_partido' },
  mensaje: { type: String, required: true },
  monto: { type: Number, default: 0 },
  reclamada: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Notificacion || mongoose.model("Notificacion", notificacionSchema);