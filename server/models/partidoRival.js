const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partidoRivalSchema = new Schema({
  equipo: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  equipoA: { type: String, required: true },
  escudoA: { type: String, default: '' },
  equipoB: { type: String, required: true },
  escudoB: { type: String, default: '' },
  golesA: { type: Number, required: true },
  golesB: { type: Number, required: true },
  jornada: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.models.PartidoRival || mongoose.model("PartidoRival", partidoRivalSchema);