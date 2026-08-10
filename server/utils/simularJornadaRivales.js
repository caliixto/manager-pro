const PartidoRival = require('../models/partidoRival');
const { obtenerNivelRival } = require('./generarEquipoInicial');
const { golesAleatorios } = require('./golesPoisson');

async function simularJornadaEntreRivales(equipoId, rivalesLiga, jornadaActual) {
  // Para que no se repita la misma jornada dos veces por error
  const yaExiste = await PartidoRival.findOne({ equipo: equipoId, jornada: jornadaActual });
  if (yaExiste) return;

  // Mezclamos aleatoriamente y emparejamos de dos en dos
  const mezclados = [...rivalesLiga].sort(() => Math.random() - 0.5);
  const partidosGenerados = [];

  for (let i = 0; i < mezclados.length - 1; i += 2) {
    const equipoA = mezclados[i];
    const equipoB = mezclados[i + 1];

    const nivelA = obtenerNivelRival(equipoA.rival);
    const nivelB = obtenerNivelRival(equipoB.rival);
    const diferencia = nivelA - nivelB;

    const expectativaA = Math.max(0.3, 1.3 + diferencia / 25);
    const expectativaB = Math.max(0.3, 1.3 - diferencia / 25);

    partidosGenerados.push({
      equipo: equipoId,
      equipoA: equipoA.rival,
      escudoA: equipoA.escudo,
      equipoB: equipoB.rival,
      escudoB: equipoB.escudo,
      golesA: golesAleatorios(expectativaA),
      golesB: golesAleatorios(expectativaB),
      jornada: jornadaActual,
    });
  }

  if (partidosGenerados.length > 0) {
    await PartidoRival.insertMany(partidosGenerados);
  }
}

module.exports = { simularJornadaEntreRivales };