const laligaPrimera = require('./laLigaPrimera');
const laligaSegunda = require('./laligaSegunda');

const LIGAS_DISPONIBLES = {
  'laliga-1': laligaPrimera,
  'laliga-2': laligaSegunda,
};

function obtenerLiga(ligaId) {
  return LIGAS_DISPONIBLES[ligaId] ?? LIGAS_DISPONIBLES['laliga-1']; // fallback por seguridad
}

module.exports = { LIGAS_DISPONIBLES, obtenerLiga };