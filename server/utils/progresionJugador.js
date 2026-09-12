// utils/progresionJugador.js

const STATS_RELEVANTES_POR_POSICION = {
  POR: ['porteria', 'posicionamiento', 'determinacion'],
  DEF: ['defensa', 'fisico', 'posicionamiento'],
  CEN: ['pase', 'vision', 'regate'],
  DEL: ['tiro', 'regate', 'posicionamiento'],
};

function calcularIncremento(statActual) {
  // A más stat actual, menos margen de subida (rendimientos decrecientes)
  const margen = (100 - statActual) / 100; // 1 si stat=0, 0 si stat=100
  const incremento = Math.round(margen * (Math.random() * 2 + 0.5)); // entre 0 y ~2.5, escalado
  return Math.min(incremento, 99 - statActual); // nunca pasar de 99
}

/**
 * Devuelve un objeto con las stats actualizadas para un jugador que jugó el partido.
 * bonusRendimiento: true si marcó gol o dio asistencia, sube un poco más ese partido.
 */
function progresionTrasPartido(jugador, { hizoGol = false, dioAsistencia = false } = {}) {
  const statsRelevantes = STATS_RELEVANTES_POR_POSICION[jugador.posicion] ?? [];
  const nuevasStats = { ...jugador.stats };

  for (const stat of statsRelevantes) {
    let incremento = calcularIncremento(nuevasStats[stat]);

    // Pequeño extra si tuvo una gran actuación (gol o asistencia)
    if ((hizoGol || dioAsistencia) && Math.random() < 0.5) {
      incremento += 1;
    }

    nuevasStats[stat] = Math.min(99, nuevasStats[stat] + incremento);
  }

  return nuevasStats;
}

module.exports = { progresionTrasPartido };