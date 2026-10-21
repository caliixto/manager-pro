const Users = require('../models/users');
const Jugador = require('../models/player');

const UMBRAL_ENERGIA_MINIMA = 40;

// Quita del once a quien no esté convocado (o no pueda jugar) y mete a un suplente de su misma posición
async function corregirAlineacion(equipoId, idsConvocados) {
  const convocados = new Set(idsConvocados.map(String));

  const equipo = await Users.findById(equipoId).populate('alineacion');
  if (!equipo?.alineacion?.length) return { cambios: [], sinSustituto: [] };

  const plantilla = await Jugador.find({ equipo: equipoId });

  const puedeJugar = (j) =>
    !j.sancionado && !j.lesionado &&
    j.resistencia >= UMBRAL_ENERGIA_MINIMA &&
    convocados.has(j._id.toString());

  const slots = equipo.alineacion.map(guardado => {
    const actual = plantilla.find(p => p._id.toString() === guardado._id.toString());
    return { guardado, actual, queda: !!actual && puedeJugar(actual) };
  });

  const usados = new Set(slots.filter(s => s.queda).map(s => s.actual._id.toString()));
  const cambios = [];
  const sinSustituto = [];

  const nuevosIds = slots.map(s => {
    if (s.queda) return s.actual._id;

    const suplente = plantilla.find(p =>
      p.posicion === s.guardado.posicion &&
      !usados.has(p._id.toString()) &&
      puedeJugar(p)
    );

    if (suplente) {
      usados.add(suplente._id.toString());
      cambios.push({ sale: s.guardado.nombre, entra: suplente.nombre });
      return suplente._id;
    }

    sinSustituto.push(s.guardado.nombre);
    return s.guardado._id;          // sin alternativa: se queda el hueco como estaba
  });

  if (cambios.length > 0) {
    await Users.findByIdAndUpdate(equipoId, { alineacion: nuevosIds });
  }

  return { cambios, sinSustituto };
}

module.exports = { corregirAlineacion };