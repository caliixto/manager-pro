const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jugadorSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  foto: {
    type: String,
    default: ''
  },
  posicion: {
    type: String,
    required: [true, 'La posición es obligatoria'],
    enum: ['POR', 'DEF', 'CEN', 'DEL']
  },
  edad: {
    type: Number,
    required: [true, 'La edad es obligatoria']
  },
  dorsal: {
    type: Number
  },
  estadoFisico: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  stats: {
    velocidad: { type: Number, min: 0, max: 100, default: 50 },
    pase: { type: Number, min: 0, max: 100, default: 50 },
    tiro: { type: Number, min: 0, max: 100, default: 50 },
    resistencia: { type: Number, min: 0, max: 100, default: 50 },
  },
  equipo: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  lesionado: {
    type: Boolean,
    default: false
  },
  sancionado: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Jugador", jugadorSchema);