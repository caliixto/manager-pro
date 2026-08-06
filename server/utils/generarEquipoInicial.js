const Jugador = require("../models/player");
const Partido = require("../models/partido");

const nombres = [
  "Ruben", "Iker", "Adrián", "Diego", "Álvaro", "Hugo", "Mario", "Pablo",
  "Sergio", "Rubén", "Javier", "Daniel", "Carlos", "Raúl", "Víctor",
  "Nacho", "Fernando", "Gonzalo", "Bruno", "Samuel"
];

const jugadoresFijos = [
  { 
    nombre: "Alexander Minaya", posicion: "POR", edad: 24, estadoFisico: 95,
    stats: {
      velocidad: 68, aceleracion: 62, fisico: 90, resistencia: 88,
      tiro: 25, pase: 78, regate: 35, defensa: 45,
      posicionamiento: 92, vision: 70, determinacion: 90,
      porteria: 96
    }
  },
  { 
    nombre: "Daniel Bonilla", posicion: "DEF", edad:25, estadoFisico: 95,
    stats: {
      velocidad: 90, aceleracion: 85, fisico: 93, resistencia: 90,
      tiro: 89, pase: 85, regate: 65, defensa: 95,
      posicionamiento: 90, vision: 75, determinacion: 95,
      porteria: 10
    }
  },
  { 
    nombre: "Calixto Bocamba", posicion: "CEN", edad: 26, estadoFisico: 95,
    stats: {
      velocidad: 93, aceleracion: 96, fisico: 85, resistencia: 82,
      tiro: 95, pase: 94, regate: 88, defensa: 68,
      posicionamiento: 90, vision: 93, determinacion: 88,
      porteria: 10
    }
  },
  { 
    nombre: "Andrés García", posicion: "DEL", edad: 24, estadoFisico: 95,
    stats: {
      velocidad: 89, aceleracion: 85, fisico: 85, resistencia: 82,
      tiro: 88, pase: 75, regate: 60, defensa: 30,
      posicionamiento: 74, vision: 75, determinacion: 90,
      porteria: 10
    }
  },
];

const apellidos = [
  "Castro", "Martínez", "López", "Sánchez", "Pérez", "Gómez", "Fernández",
  "Ruiz", "Díaz", "Torres", "Romero", "Alonso", "Gil", "Vega", "Castro",
  "Ortiz", "Rubio", "Marín", "Nuñez", "Iglesias"
];

const posicionesBase = [
  // Titulares (11): 1 POR + 4 DEF + 3 CEN + 3 DEL
  "POR", "DEF", "DEF", "DEF", "DEF", "CEN", "CEN", "CEN", "DEL", "DEL", "DEL",
  // Suplentes (11): Igual que los titulares
  "POR", "DEF", "DEF", "DEF", "DEF", "CEN", "CEN", "CEN", "DEL", "DEL", "DEL",
  // Extra (3): margen para rotación (RESERVAS)
  "DEF", "CEN", "DEL"
];

const rivalesFuturos = [
  { rival: "Real Madrid CF", formacion: "4-3-3 FD", escudo: "/img/realMadrid.png",competicion: "amistoso"},
  { rival: "Manchester United FC", formacion: "4-4-2", escudo: "/img/united.png", competicion: "amistoso"},
  { rival: "Boca Juniors", formacion: "3-5-2", escudo: "/img/boca.avif", competicion: "amistoso" },
  { rival: "FC Barcelona", formacion: "4-3-3", escudo: "/img/barcelona.png", competicion: "amistoso" },
  { rival: "Inter de Milan", formacion: "4-2-3-1", escudo: "/img/inter.avif", competicion: "amistoso" },
  { rival: "Liverpool FC", formacion: "5-3-2", escudo: "/img/liverpool.png", competicion: "amistoso" },

  { rival: "Valencia", formacion: "4-4-2", escudo: "/img/valencia.png", competicion: "liga" },
  { rival: "Sevilla", formacion: "4-3-3", escudo: "/img/sevilla.png", competicion: "liga" },
  { rival: "Athletic Club", formacion: "4-2-3-1", escudo: "/img/AthleticBilbao.png", competicion: "liga" },
  { rival: "Real Sociedad", formacion: "4-3-3", escudo: "/img/sociedad.png", competicion: "liga" },
  { rival: "Villarreal C.F.", formacion: "4-4-2", escudo: "/img/villarreal.png", competicion: "liga" },
  { rival: "Celta De vigo", formacion: "3-5-2", escudo: "/img/celta.png", competicion: "liga" },
  { rival: "Real Zaragoza", formacion: "4-2-3-1", escudo: "/img/zaragoza.png", competicion: "liga" },
  { rival: "RCD Espanyol", formacion: "4-3-3", escudo: "/img/rcdespanyol.png", competicion: "liga" },
  { rival: "Real Valladolid", formacion: "4-4-2", escudo: "/img/valladolid.png", competicion: "liga" },
  { rival: "CD Tenerife", formacion: "5-3-2", escudo: "/img/tenerife.png", competicion: "liga" },
  { rival: "UD Las Palmas", formacion: "4-3-3", escudo: "/img/LasPalmas.png", competicion: "liga" },
  { rival: "SD Eibar", formacion: "4-4-2", escudo: "/img/eibar.png", competicion: "liga" },
  { rival: "Málaga CF", formacion: "4-3-3", escudo: "/img/Malaga.png", competicion: "liga" },
  { rival: "Deportivo de La Coruña", formacion: "4-2-3-1", escudo: "/img/LaCoruña.png", competicion: "liga" },
  { rival: "Granada CF", formacion: "5-3-2", escudo: "/img/granada.png", competicion: "liga" }
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
      return {
        velocidad: randomEntre(40, 65),
        aceleracion: randomEntre(35, 60),
        fisico: randomEntre(65, 88),
        resistencia: randomEntre(60, 85),
        tiro: randomEntre(15, 30),
        pase: randomEntre(45, 70),
        regate: randomEntre(20, 40),
        defensa: randomEntre(30, 50),
        posicionamiento: randomEntre(65, 90),
        vision: randomEntre(40, 65),
        determinacion: randomEntre(55, 80),
        porteria: randomEntre(70, 95),
      };
    case "DEF":
      return {
        velocidad: randomEntre(55, 80),
        aceleracion: randomEntre(50, 75),
        fisico: randomEntre(68, 90),
        resistencia: randomEntre(65, 88),
        tiro: randomEntre(25, 50),
        pase: randomEntre(50, 75),
        regate: randomEntre(35, 60),
        defensa: randomEntre(70, 92),
        posicionamiento: randomEntre(65, 88),
        vision: randomEntre(45, 70),
        determinacion: randomEntre(60, 85),
        porteria: randomEntre(5, 15),
      };
    case "CEN":
      return {
        velocidad: randomEntre(60, 82),
        aceleracion: randomEntre(58, 80),
        fisico: randomEntre(60, 82),
        resistencia: randomEntre(70, 90),
        tiro: randomEntre(50, 75),
        pase: randomEntre(70, 92),
        regate: randomEntre(60, 85),
        defensa: randomEntre(45, 70),
        posicionamiento: randomEntre(65, 88),
        vision: randomEntre(65, 90),
        determinacion: randomEntre(55, 80),
        porteria: randomEntre(5, 15),
      };
    case "DEL":
      return {
        velocidad: randomEntre(70, 92),
        aceleracion: randomEntre(70, 92),
        fisico: randomEntre(60, 85),
        resistencia: randomEntre(55, 80),
        tiro: randomEntre(70, 93),
        pase: randomEntre(50, 75),
        regate: randomEntre(65, 88),
        defensa: randomEntre(20, 40),
        posicionamiento: randomEntre(70, 92),
        vision: randomEntre(50, 75),
        determinacion: randomEntre(60, 88),
        porteria: randomEntre(5, 15),
      };
    default:
      return {
        velocidad: 50, aceleracion: 50, fisico: 50, resistencia: 50,
        tiro: 50, pase: 50, regate: 50, defensa: 50,
        posicionamiento: 50, vision: 50, determinacion: 50, porteria: 50,
      };
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
 * Generamos un la plantilla de 25 jugadores y el calendario inicial de partidos
 * para un usuario recién registrado.
 * @param {string} equipoId - El _id del usuario/coach recién creado
 */
const generarEquipoInicial = async (equipoId) => {
  // Jugadores fijos (tú y tus amigos)
    const jugadoresFijosGenerados = jugadoresFijos.map((info, index) => ({
    nombre: info.nombre,
    posicion: info.posicion,
    edad: info.edad,
    dorsal: index + 1,
    estadoFisico: info.estadoFisico,
    stats: info.stats,
    equipo: equipoId,
    foto:`https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(info.nombre)}&gender=male`
  }));

  //Jugadores aleatorios para completar la plantilla
  const posicionesRestantes = posicionesBase.slice(jugadoresFijos.length);
  
 const jugadoresAleatoriosGenerados = posicionesRestantes.map((posicion, index) => {
  const nombreGenerado = generarNombreAleatorio();
  
  return {
    nombre: nombreGenerado,
    posicion,
    edad: randomEntre(18, 34),
    dorsal: jugadoresFijos.length + index + 1,
    estadoFisico: randomEntre(70, 100),
    stats: generarStatsPorPosicion(posicion),
    equipo: equipoId,
    foto: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(nombreGenerado)}&gender=male`
  };
});

  const todosLosJugadores = [...jugadoresFijosGenerados, ...jugadoresAleatoriosGenerados];
  const jugadoresCreados = await Jugador.insertMany(todosLosJugadores);

  // Partidos

  const escudosDisponibles = [
    '/img/realMadrid.png',
    '/img/barcelona.png',
    '/img/boca.avif',
    '/img/united.png',
    '/img/inter.avif',
    '/img/liverpool.png'
  ];


  const partidosGenerados = rivalesFuturos.map((info, index) => ({
    rival: info.rival,
    escudo:info.escudo,
    fecha: fechaEnDias((index + 1) * 7),
    lugar: lugares[randomEntre(0, 1)],
    formacionRival: info.formacion,
    jugado: false,
    equipo: equipoId,
  }));
  const partidosCreados = await Partido.insertMany(partidosGenerados);

  // Convocatoria automática con todos los disponibles
  const idsJugadores = jugadoresCreados.map(j => j._id);
  const primerPartido = partidosCreados[0];

  await Partido.findByIdAndUpdate(primerPartido._id, {
    convocados: idsJugadores
  });
};

const seleccionarTitulares = (jugadoresConvocados) => {
  const porteros = jugadoresConvocados.filter(j => j.posicion === 'POR');
  const defensas = jugadoresConvocados.filter(j => j.posicion === 'DEF');
  const centrocampistas = jugadoresConvocados.filter(j => j.posicion === 'CEN');
  const delanteros = jugadoresConvocados.filter(j => j.posicion === 'DEL');

  // Formación ideal (1-4-3-3)
  let titulares = [
    ...porteros.slice(0, 1),
    ...defensas.slice(0, 4),
    ...centrocampistas.slice(0, 3),
    ...delanteros.slice(0, 3),
  ];

  // Si faltan para llegar a 11, completa con quien quede disponible
  if (titulares.length < 11) {
    const yaSeleccionadosIds = titulares.map(j => j._id.toString());
    const restantes = jugadoresConvocados.filter(j => !yaSeleccionadosIds.includes(j._id.toString()));
    const faltan = 11 - titulares.length;
    titulares = [...titulares, ...restantes.slice(0, faltan)];
  }

  return titulares;
};

const puedeJugarPartido = (totalConvocados) => {
  return totalConvocados >= 7;
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

// constants/nivelesRivales.js
const NIVEL_RIVALES = {
  // Amistosos contra grandes clubes — nivel muy alto, partidos "trampa"
  "Real Madrid CF": 92,
  "Manchester United FC": 88,
  "Boca Juniors": 85,
  "FC Barcelona": 93,
  "Inter de Milan": 87,
  "Liverpool FC": 89,

  // Liga — nivel más variado, más realista para tu progresión
  "Valencia": 68,
  "Sevilla": 70,
  "Athletic Club": 72,
  "Real Sociedad": 71,
  "Villarreal C.F.": 69,
  "Celta De vigo": 62,
  "Real Zaragoza": 58,
  "RCD Espanyol": 60,
  "Real Valladolid": 55,
  "CD Tenerife": 50,
  "UD Las Palmas": 57,
  "SD Eibar": 52,
  "Málaga CF": 54,
  "Deportivo de La Coruña": 56,
  "Granada CF": 59,
};

const NIVEL_DEFAULT = 60;

function obtenerNivelRival(nombreRival) {
  return NIVEL_RIVALES[nombreRival] ?? NIVEL_DEFAULT;
}

module.exports = { generarEquipoInicial, listar, seleccionarTitulares, puedeJugarPartido, NIVEL_RIVALES, obtenerNivelRival, rivalesFuturos};