const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendarioRivalesSchema = new Schema({
  equipo: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  jornada: { type: Number, required: true },
  equipoA: { type: String, required: true },
  escudoA: { type: String, default: '' },
  equipoB: { type: String, required: true },
  escudoB: { type: String, default: '' },
});

module.exports = mongoose.models.CalendarioRivales || mongoose.model("CalendarioRivales", calendarioRivalesSchema);