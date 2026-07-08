//importamos la libreria de mongoose

const { Schema, model } = require("mongoose");
const { trim } = require("validator");

//Creamos el esquema (la estrucutra de cada documento de tipo proyecto);

const adminSchema = new Schema({
  usuario: {
    type: String,
    required: [true, 'El Usuario es obligatorio'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatorio'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

})


//Expotar modelos

module.exports = model('admin', adminSchema);