const Jugador = require("../models/player");
const Partido = require("../models/partido");

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

const posicionesBase = [
  "POR", "DEF", "DEF", "DEF", "DEF", "CEN", "CEN", "CEN", "DEL", "DEL", "DEL",
  "POR", "DEF", "DEF", "CEN", "CEN", "DEL", "DEL"
];

const rivalesFuturos = [
  { rival: "Los Leones FC", formacion: "4-3-3 FD" },
  { rival: "Deportivo Águilas", formacion: "4-4-2" },
  { rival: "CD Tornado", formacion: "3-5-2" },
];

const rivalesJugados = [
  { rival: "Atlético Barrio", formacion: "4-3-3" },
  { rival: "FC Barcelona Amateur", formacion: "4-3-3 FD" },
  { rival: "Real Betis Juvenil", formacion: "4-2-2 FD" },
  { rival: "Unión Deportiva Sur", formacion: "5-3-2" },
  { rival: "Racing Norte", formacion: "4-4-2" },
];

const lugares = ["casa", "fuera"];
const randomEntre = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generarNombreAleatorio = () => {
  const nombre = nombres[randomEntre(0, nombres.length - 1)];
  const apellido = apellidos[randomEntre(0, apellidos.length - 1)];
  return `${nombre} ${apellido}`;
};

const generarStatsPorPosicion = (posicion) => {
  switch (posicion) {
    case "POR":
      return { velocidad: randomEntre(40, 60), pase: randomEntre(45, 65), tiro: randomEntre(20, 35), resistencia: randomEntre(50, 70) };
    case "DEF":
      return { velocidad: randomEntre(45, 65), pase: randomEntre(50, 70), tiro: randomEntre(30, 50), resistencia: randomEntre(60, 80) };
    case "CEN":
      return { velocidad: randomEntre(55, 75), pase: randomEntre(65, 85), tiro: randomEntre(50, 70), resistencia: randomEntre(65, 85) };
    case "DEL":
      return { velocidad: randomEntre(65, 85), pase: randomEntre(50, 70), tiro: randomEntre(65, 90), resistencia: randomEntre(55, 75) };
    default:
      return { velocidad: 50, pase: 50, tiro: 50, resistencia: 50 };
  }
};

const generarResultado = () => {
  const tipo = randomEntre(1, 10);
  if (tipo <= 5) return { golesPropios: randomEntre(1, 5), golesRival: randomEntre(0, 2) };
  if (tipo <= 7) { const g = randomEntre(0, 3); return { golesPropios: g, golesRival: g }; }
  return { golesPropios: randomEntre(0, 2), golesRival: randomEntre(1, 4) };
};

const fechaHaceDias = (dias) => { const f = new Date(); f.setDate(f.getDate() - dias); return f; };
const fechaEnDias = (dias) => { const f = new Date(); f.setDate(f.getDate() + dias); return f; };

/**
 * Genera la plantilla de 18 jugadores y el calendario inicial de partidos
 * para un usuario recién registrado.
 * @param {string} equipoId - El _id del usuario/coach recién creado
 */
const generarEquipoInicial = async (equipoId) => {
  // Jugadores
  const jugadoresGenerados = posicionesBase.map((posicion, index) => ({
    nombre: generarNombreAleatorio(),
    posicion,
    edad: randomEntre(18, 34),
    dorsal: index + 1,
    estadoFisico: randomEntre(70, 100),
    stats: generarStatsPorPosicion(posicion),
    equipo: equipoId,
  }));
  await Jugador.insertMany(jugadoresGenerados);

  // Partidos
   const partidosGenerados= rivalesFuturos.map((info, index) => ({
      rival: info.rival,
      fecha: fechaEnDias((index + 1) * 7),
      lugar: lugares[randomEntre(0, 1)],
      formacionRival: info.formacion,
      jugado: false,
      equipo: equipoId,
  }));
  await Partido.insertMany(partidosGenerados);
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

module.exports = { generarEquipoInicial, listar };