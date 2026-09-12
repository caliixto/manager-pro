// utils/calcularPremio.js

const MULTIPLICADOR_COMPETICION = {
  liga: 1,
  'copa campeones': 2,
  'copa triunfo': 1.3,
  'segunda division': 1,
  amistoso: 0.3,
};

function calcularPremioBase(nivelRival) {
  // Interpolamos: nivel 40 -> 40.000€, nivel 95 -> 300.000€
  const nivelMin = 40, nivelMax = 95;
  const premioMin = 40000, premioMax = 300000;

  const nivelClamp = Math.max(nivelMin, Math.min(nivelMax, nivelRival));
  const proporcion = (nivelClamp - nivelMin) / (nivelMax - nivelMin);

  return Math.round(premioMin + proporcion * (premioMax - premioMin));
}

function calcularMultiplicadorResultado(golesPropios, golesRival) {
  if (golesPropios > golesRival) return 1;      // victoria
  if (golesPropios === golesRival) return 0.4;  // empate
  return 0.15;                                  // derrota
}

function calcularPremioPartido({ nivelRival, competicion, golesPropios, golesRival }) {
  const premioBase = calcularPremioBase(nivelRival);
  const multCompeticion = MULTIPLICADOR_COMPETICION[competicion] ?? 1;
  const multResultado = calcularMultiplicadorResultado(golesPropios, golesRival);

  return Math.round(premioBase * multCompeticion * multResultado);
}

module.exports = { calcularPremioPartido };