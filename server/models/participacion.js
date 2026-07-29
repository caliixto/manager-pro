const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participacionSchema = new Schema({
  jugador: { type: Schema.Types.ObjectId, ref: 'Jugador', required: true },
  partido: { type: Schema.Types.ObjectId, ref: 'Partido', required: true },
  titular: { type: Boolean, default: true },
  minutosJugados: { type: Number, default: 90 },
  goles: { type: Number, default: 0 },
  asistencias: { type: Number, default: 0 },
  tarjetaAmarilla: { type: Boolean, default: false },
  tarjetaRoja: { type: Boolean, default: false },
});

module.exports = mongoose.model("Participacion", participacionSchema);