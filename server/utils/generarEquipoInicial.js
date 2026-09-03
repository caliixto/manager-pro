const Jugador = require("../models/player");
const Partido = require("../models/partido");
const { generarCalendarioCompleto} = require('./generarCalendarioLiga');
const CalendarioRivales = require('../models/calendarioRivales');
const { obtenerLiga } = require('../data/ligas');
const Users = require("../models/users");

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
      porteria: 98
    }
  },
  { 
    nombre: "Daniel Bonilla", posicion: "DEF", edad:25, estadoFisico: 95,
    stats: {
      velocidad: 90, aceleracion: 85, fisico: 96, resistencia: 90,
      tiro: 89, pase: 85, regate: 65, defensa: 95,
      posicionamiento: 95, vision: 85, determinacion: 95,
      porteria: 10
    }
  },
  { 
    nombre: "Calixto Bocamba", posicion: "CEN", edad: 26, estadoFisico: 95,
    stats: {
      velocidad: 96, aceleracion: 96, fisico: 85, resistencia: 92,
      tiro: 95, pase: 97, regate: 90, defensa: 70,
      posicionamiento: 92, vision: 97, determinacion: 92,
      porteria: 10
    }
  },
  { 
    nombre: "Andrés García", posicion: "DEL", edad: 24, estadoFisico: 95,
    stats: {
      velocidad: 89, aceleracion: 85, fisico: 85, resistencia: 92,
      tiro: 94, pase: 75, regate: 80, defensa: 30,
      posicionamiento: 84, vision: 75, determinacion: 90,
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


/**
 * Generamos un la plantilla de 25 jugadores y el calendario inicial de partidos
 * para un usuario recién registrado.
 * @param {string} equipoId - El _id del usuario/coach recién creado
 */

const generarEquipoInicial = async (equipoId, ligaId = 'laliga-1') => {
  const ligaSeleccionada = obtenerLiga(ligaId);
  const esPrimeraDivision = ligaSeleccionada.division === 1;

  let todosLosJugadores = [];

  if (esPrimeraDivision) {
    // Con los 4 fijos, igual que ahora
    const jugadoresFijosGenerados = jugadoresFijos.map((info, index) => ({
      nombre: info.nombre,
      posicion: info.posicion,
      edad: info.edad,
      dorsal: index + 1,
      estadoFisico: info.estadoFisico,
      stats: info.stats,
      equipo: equipoId,
      foto: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(info.nombre)}&gender=male`
    }));

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

    todosLosJugadores = [...jugadoresFijosGenerados, ...jugadoresAleatoriosGenerados];

  } else {
    // Segunda División: 25 jugadores TODOS random, sin los 4 "regalo"
    todosLosJugadores = posicionesBase.map((posicion, index) => {
      const nombreGenerado = generarNombreAleatorio();
      return {
        nombre: nombreGenerado,
        posicion,
        edad: randomEntre(18, 34),
        dorsal: index + 1,
        estadoFisico: randomEntre(70, 100),
        stats: generarStatsPorPosicion(posicion),
        equipo: equipoId,
        foto: `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(nombreGenerado)}&gender=male`
      };
    });
  }

  const jugadoresCreados = await Jugador.insertMany(todosLosJugadores);

  const { partidosUsuario, cruceRivales } = generarCalendarioCompleto(ligaSeleccionada.rivalesFuturos);

  const partidosGenerados = partidosUsuario.map(info => ({
    rival: info.rival,
    escudo: info.escudo,
    fecha: info.fecha,
    lugar: info.lugar,
    formacionRival: info.formacion,
    jugado: false,
    equipo: equipoId,
    competicion: 'liga',
    jornada: info.jornada,
  }));
  const partidosCreados = await Partido.insertMany(partidosGenerados);

  const fixtureRivales = cruceRivales.map(c => ({ ...c, equipo: equipoId }));
  await CalendarioRivales.insertMany(fixtureRivales);

  const idsJugadores = jugadoresCreados.map(j => j._id);
  const primerPartido = partidosCreados[0];
  await Partido.findByIdAndUpdate(primerPartido._id, { convocados: idsJugadores });

  // Guardamos la liga elegida en el propio usuario, para usarla luego en obtenerNivelRival
  await Users.findByIdAndUpdate(equipoId, { liga: ligaId });
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


function obtenerNivelRival(nombreRival, ligaId = 'laliga-1') {
  const liga = obtenerLiga(ligaId);
  return liga.NIVEL_RIVALES[nombreRival] ?? 60;
}

module.exports = { generarEquipoInicial, listar, seleccionarTitulares, puedeJugarPartido, obtenerNivelRival};