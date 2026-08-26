const PartidoRival = require('../models/partidoRival');
const { obtenerNivelRival } = require('./generarEquipoInicial');
const { golesAleatorios } = require('./golesPoisson');
const CalendarioRivales = require('../models/calendarioRivales');

async function simularJornadaEntreRivales(equipoId, jornadaActual) {
  // Evitamos duplicar si esta jornada ya se simuló antes
  const yaExiste = await PartidoRival.findOne({ equipo: equipoId, jornada: jornadaActual });
  if (yaExiste) return;

  const cruces = await CalendarioRivales.find({ equipo: equipoId, jornada: jornadaActual });
  console.log('🔵 Jornada consultada:', jornadaActual, '— Cruces encontrados:', cruces.length);

  const partidosGenerados = cruces.map(c => {
    const nivelA = obtenerNivelRival(c.equipoA);
    const nivelB = obtenerNivelRival(c.equipoB);
    const diferencia = nivelA - nivelB;

    const expectativaA = Math.max(0.3, 1.3 + diferencia / 25);
    const expectativaB = Math.max(0.3, 1.3 - diferencia / 25);

    return {
      equipo: equipoId,
      equipoA: c.equipoA,
      escudoA: c.escudoA,
      equipoB: c.equipoB,
      escudoB: c.escudoB,
      golesA: golesAleatorios(expectativaA),
      golesB: golesAleatorios(expectativaB),
      jornada: jornadaActual,
    };
  });

  if (partidosGenerados.length > 0) {
    await PartidoRival.insertMany(partidosGenerados);
  }
}

module.exports = { simularJornadaEntreRivales };