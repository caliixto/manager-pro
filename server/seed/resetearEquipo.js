// server/seeds/resetearEquipo.js
require("dotenv").config();
const mongoose = require("mongoose");
const Jugador = require("../models/player");
const Partido = require("../models/partido");
const Participacion = require("../models/participacion");
const { generarEquipoInicial } = require("../utils/generarEquipoInicial");
const {PartidoRival} = require ("../models/partidoRival");
const partidoRival = require("../models/partidoRival");

const EQUIPO_ID = "6a6aa10d476a773c66717b76";

const resetear = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  console.log("Buscando jugadores existentes...");
  const jugadoresAntiguos = await Jugador.find({ equipo: EQUIPO_ID });
  const idsJugadoresAntiguos = jugadoresAntiguos.map(j => j._id);

  console.log("Borrando datos antiguos...");
  await Participacion.deleteMany({ jugador: { $in: idsJugadoresAntiguos } });
  await Jugador.deleteMany({ equipo: EQUIPO_ID });
  await Partido.deleteMany({ equipo: EQUIPO_ID});
  await partidoRival.deleteMany({equipo: EQUIPO_ID});

  console.log("Generando datos nuevos con el código actual...");
  await generarEquipoInicial(EQUIPO_ID);

  console.log("✅ Equipo reseteado correctamente. Ya puedes hacer login con tu usuario de siempre.");
  process.exit(0);
};

resetear();