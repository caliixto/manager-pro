require("dotenv").config();
const mongoose = require("mongoose");
const Jugador = require("../models/player");

// 👇 Cambia esto por el _id real de tu usuario de pruebas
const EQUIPO_ID = "6a4ee124d1fcae9af028e3be";

const nombres = [
  "Marcos", "Iker", "Adrián", "Diego", "Álvaro", "Hugo", "Mario", "Pablo",
  "Sergio", "Rubén", "Javier", "Daniel", "Carlos", "Raúl", "Víctor",
  "Nacho", "Fernando", "Gonzalo", "Bruno", "Samuel"
];

const apellidos = [
  "García", "Martínez", "López", "Sánchez", "Pérez", "Gómez", "Fernández",
  "Ruiz", "Díaz", "Torres", "Romero", "Alonso", "Gil", "Vega", "Castro",
  "Ortiz", "Rubio", "Marín", "Nuñez", "Iglesias"
];

// Formación base: 1 portero, 4 defensas, 3 centrocampistas, 3 delanteros
// + 7 suplentes variados = 18 jugadores en total
const posicionesBase = [
  "POR",
  "DEF", "DEF", "DEF", "DEF",
  "CEN", "CEN", "CEN",
  "DEL", "DEL", "DEL",
  // Suplentes
  "POR",
  "DEF", "DEF",
  "CEN", "CEN",
  "DEL", "DEL"
];

// Genera un número aleatorio entre min y max (incluidos)
const randomEntre = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generarNombreAleatorio = () => {
  const nombre = nombres[randomEntre(0, nombres.length - 1)];
  const apellido = apellidos[randomEntre(0, apellidos.length - 1)];
  return `${nombre} ${apellido}`;
};

const generarStatsPorPosicion = (posicion) => {
  // Los rangos varían un poco según la posición, para que tenga sentido futbolístico
  switch (posicion) {
    case "POR":
      return {
        velocidad: randomEntre(40, 60),
        pase: randomEntre(45, 65),
        tiro: randomEntre(20, 35),
        resistencia: randomEntre(50, 70),
      };
    case "DEF":
      return {
        velocidad: randomEntre(45, 65),
        pase: randomEntre(50, 70),
        tiro: randomEntre(30, 50),
        resistencia: randomEntre(60, 80),
      };
    case "CEN":
      return {
        velocidad: randomEntre(55, 75),
        pase: randomEntre(65, 85),
        tiro: randomEntre(50, 70),
        resistencia: randomEntre(65, 85),
      };
    case "DEL":
      return {
        velocidad: randomEntre(65, 85),
        pase: randomEntre(50, 70),
        tiro: randomEntre(65, 90),
        resistencia: randomEntre(55, 75),
      };
    default:
      return { velocidad: 50, pase: 50, tiro: 50, resistencia: 50 };
  }
};

const seedJugadores = async () => {
  try {
    await mongoose.connect("mongodb+srv://calixto2jcc_db_user:qwlWmMV9uoUoGE7P@cluster0.r5xjf1z.mongodb.net/ManagerPro");

    console.log("Conectado a MongoDB, generando plantilla...");

    const jugadoresGenerados = posicionesBase.map((posicion, index) => ({
      nombre: generarNombreAleatorio(),
      posicion,
      edad: randomEntre(18, 34),
      dorsal: index + 1,
      estadoFisico: randomEntre(70, 100),
      stats: generarStatsPorPosicion(posicion),
      equipo: EQUIPO_ID,
    }));

    await Jugador.insertMany(jugadoresGenerados);

    console.log(`✅ Se han creado ${jugadoresGenerados.length} jugadores para el equipo ${EQUIPO_ID}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al generar la plantilla:", error);
    process.exit(1);
  }
};

const listar = async (req, res) => {
  try {
    const equipo = req.user.id;
    const jugadores = await Jugador.find({ equipo });
    console.log(jugadores);
    return res.json({
      status: "success",
      total: jugadores.length,
      jugadores
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

module.exports = {
  listar
}