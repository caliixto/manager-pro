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
  // Físico
  velocidad: { type: Number, min: 0, max: 100, default: 50 },
  aceleracion: { type: Number, min: 0, max: 100, default: 50 },
  fisico: { type: Number, min: 0, max: 100, default: 50 },
  resistencia: { type: Number, min: 0, max: 100, default: 50 },
  
  // Técnico
  tiro: { type: Number, min: 0, max: 100, default: 50 },
  pase: { type: Number, min: 0, max: 100, default: 50 },
  regate: { type: Number, min: 0, max: 100, default: 50 },
  defensa: { type: Number, min: 0, max: 100, default: 50 },
  
  // Mental
  posicionamiento: { type: Number, min: 0, max: 100, default: 50 },
  vision: { type: Number, min: 0, max: 100, default: 50 },
  determinacion: { type: Number, min: 0, max: 100, default: 50 },
  
  // Portero
  porteria: { type: Number, min: 0, max: 100, default: 50 },
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