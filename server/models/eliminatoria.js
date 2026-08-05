const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eliminatoriaSchema = new Schema({
  equipo: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  ronda: { type: String, enum: ['dieciseisavos','octavos','cuartos','semis','final'], required: true },
  rival: { rival: String, escudo: String, nivel: Number },
  eliminado: { type: Boolean, default: false },
});

module.exports = model('eliminatoria', eliminatoriaSchema);