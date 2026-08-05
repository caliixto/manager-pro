const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partidoSchema = new Schema({
  rival: {
    type: String,
    required: [true, 'El nombre del rival es obligatorio'],
    trim: true
  },
  escudo: {
    type: String,
    default: ''
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  lugar: {
    type: String,
    enum: ['casa', 'fuera'],
    default: 'casa'
  },
  formacionRival: {
    type: String,
    default: ''
  },
  jugado: {
    type: Boolean,
    default: false
  },
  resultado: {
    golesPropios: { type: Number, default: null },
    golesRival: { type: Number, default: null }
  },
  equipo: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  convocados: [{
    type: Schema.Types.ObjectId,
    ref: 'Jugador'
  }],
  competicion: {
    type: String,
    enum: ['liga oro', 'copa de campeones', 'copa de triunfo'],
    required: true,
    default: 'liga oro'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Partido || mongoose.model("Partido", partidoSchema);