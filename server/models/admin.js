//importamos la libreria de mongoose

const { Schema, model } = require("mongoose");
const { trim } = require("validator");

//Creamos el esquema (la estrucutra de cada documento de tipo proyecto);

const adminSchema = new Schema({
  nombrecompleto:{
    type:String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El Email es obligatorio'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatorio'],
    trim: true
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

})


//Expotar modelos

module.exports = model('admin', adminSchema);