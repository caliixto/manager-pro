// utils/simularPartido.js
const Jugador = require('../models/player');
const Partido = require('../models/Partido');
const Participacion = require('../models/participacion');
const { obtenerNivelRival } = require('../utils/generarEquipoInicial');

// Nivel de un jugador: media de sus 12 stats
function calcularNivelJugador(jugador) {
  const s = jugador.stats;
  const valores = Object.values(s);
  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

// Genera un número de goles a partir de una "expectativa" (más realista que un rango fijo)
function golesAleatorios(expectativa) {
  // Aproximación simple de Poisson: sumamos varias tiradas random pequeñas
  let goles = 0;
  let lambda = Math.max(expectativa, 0.1);
  let p = Math.exp(-lambda);
  let acumulado = p;
  let r = Math.random();
  while (acumulado < r && goles < 8) {
    goles++;
    p *= lambda / goles;
    acumulado += p;
  }
  return goles;
}

async function simularSiguientePartido(equipoId) {
  // 1. Buscamos el próximo partido sin jugar, el más cercano en fecha
  const partido = await Partido.findOne({ equipo: equipoId, jugado: false })
    .sort({ fecha: 1 });

  if (!partido) {
    throw new Error('No hay partidos pendientes en el calendario');
  }

  // 2. Traemos la plantilla y elegimos titulares reales por posición (1-4-3-3)
  const jugadores = await Jugador.find({ equipo: equipoId, lesionado: false, sancionado: false });

  const porteros = jugadores.filter(j => j.posicion === 'POR');
  const defensas = jugadores.filter(j => j.posicion === 'DEF');
  const centros = jugadores.filter(j => j.posicion === 'CEN');
  const delanteros = jugadores.filter(j => j.posicion === 'DEL');

  const titulares = [
    ...porteros.slice(0, 1),
    ...defensas.slice(0, 4),
    ...centros.slice(0, 3),
    ...delanteros.slice(0, 3),
  ];

  if (titulares.length < 7) {
    throw new Error('No hay suficientes jugadores disponibles (mínimo 7, regla FIFA)');
  }

  // 3. Calculamos nivel medio de tu equipo vs nivel del rival
  const nivelEquipo = titulares.reduce((acc, j) => acc + calcularNivelJugador(j), 0) / titulares.length;
  const nivelRival = obtenerNivelRival(partido.rival);
  const diferencia = nivelEquipo - nivelRival;

  // Expectativa de goles: 1.3 de base +/- según diferencia de nivel (tope razonable)
  const expectativaPropia = Math.max(0.3, 1.3 + diferencia / 25);
  const expectativaRival = Math.max(0.3, 1.3 - diferencia / 25);

  const golesPropios = golesAleatorios(expectativaPropia);
  const golesRival = golesAleatorios(expectativaRival);

  // 4. Repartimos los goles/asistencias entre titulares, con más probabilidad para delanteros/centros
  const pesoGol = (j) => j.posicion === 'DEL' ? 3 : j.posicion === 'CEN' ? 2 : j.posicion === 'DEF' ? 0.5 : 0.1;

  function elegirJugadorPonderado(lista, pesoFn) {
    const total = lista.reduce((acc, j) => acc + pesoFn(j), 0);
    let r = Math.random() * total;
    for (const j of lista) {
      r -= pesoFn(j);
      if (r <= 0) return j;
    }
    return lista[lista.length - 1];
  }

  const registrosGol = {};   // jugadorId -> goles
  const registrosAsist = {}; // jugadorId -> asistencias

  for (let i = 0; i < golesPropios; i++) {
    const goleador = elegirJugadorPonderado(titulares, pesoGol);
    registrosGol[goleador._id] = (registrosGol[goleador._id] ?? 0) + 1;

    // 60% de probabilidad de que el gol tenga asistencia de otro jugador
    if (Math.random() < 0.6) {
      const candidatosAsist = titulares.filter(j => j._id.toString() !== goleador._id.toString());
      const asistente = elegirJugadorPonderado(candidatosAsist, pesoGol);
      registrosAsist[asistente._id] = (registrosAsist[asistente._id] ?? 0) + 1;
    }
  }

  // 5. Tarjetas: pequeña probabilidad por jugador, más en defensas/centros
  const participaciones = titulares.map(jugador => {
    const probAmarilla = jugador.posicion === 'DEF' ? 0.18 : jugador.posicion === 'CEN' ? 0.12 : 0.06;
    const tarjetaAmarilla = Math.random() < probAmarilla;
    const tarjetaRoja = tarjetaAmarilla && Math.random() < 0.08; // rara, y solo tras amarilla

    return {
      jugador: jugador._id,
      partido: partido._id,
      goles: registrosGol[jugador._id] ?? 0,
      asistencias: registrosAsist[jugador._id] ?? 0,
      tarjetaAmarilla,
      tarjetaRoja,
      minutosJugados: 90,
    };
  });

  await Participacion.insertMany(participaciones);

  // 6. Actualizamos el Partido con el resultado real
  partido.jugado = true;
  partido.resultado = { golesPropios, golesRival };
  partido.convocados = titulares.map(j => j._id);
  await partido.save();

  return {
    rival: partido.rival,
    resultado: `${golesPropios} - ${golesRival}`,
    nivelEquipo: Math.round(nivelEquipo),
    nivelRival,
    goleadores: Object.entries(registrosGol).map(([id, goles]) => {
      const j = titulares.find(t => t._id.toString() === id);
      return `${j.nombre}: ${goles}`;
    }),
  };
}

module.exports = { simularSiguientePartido };