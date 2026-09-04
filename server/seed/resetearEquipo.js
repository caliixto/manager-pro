// server/seeds/resetearEquipo.js
require("dotenv").config();
const mongoose = require("mongoose");
const Jugador = require("../models/player");
const Partido = require("../models/partido");
const Participacion = require("../models/participacion");
const { generarEquipoInicial } = require("../utils/generarEquipoInicial");
const partidoRival = require("../models/partidoRival");
const Users = require("../models/users");
const CalendarioRivales = require("../models/calendarioRivales");

const EQUIPO_ID = "6a6aa10d476a773c66717b76";
const LIGA_ID = process.argv[2] || "laliga-1"; // ← nuevo: permite elegir liga desde la terminal

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
  await CalendarioRivales.deleteMany({equipo: EQUIPO_ID});

  console.log(`Generando datos nuevos con el código actual (liga: ${LIGA_ID})...`);
  await generarEquipoInicial(EQUIPO_ID, LIGA_ID);
  await Users.findByIdAndUpdate(EQUIPO_ID, { $set: { monedas: 5000000 } });

  console.log("✅ Equipo reseteado correctamente. Ya puedes hacer login con tu usuario de siempre.");
  process.exit(0);
};

resetear();