// utils/calcularClasificacion.js
const Partido = require('../models/partido');
const Users = require('../models/users');
const { rivalesFuturos } = require('./generarEquipoInicial');
const PartidoRival = require('../models/partidoRival');
const partido = require('../models/partido');
const {obtenerLiga} = require("../data/ligas")

async function calcularClasificacionLiga(equipoId, ligaId = 'laliga-1') {
  const usuario = await Users.findById(equipoId);
  const nombreEquipoUsuario = usuario?.nombreEquipo || 'Equipo Default';
  const escudoUsuario = usuario?.escudo || '/img/miteam.webp';
  const ligaSeleccionada = obtenerLiga(ligaId);

  const nombreCompeticion = ligaSeleccionada.ligaId; 

  const partidosLiga = await Partido.find({
    equipo: equipoId,
    competicion: nombreCompeticion,
    jugado: true,
  });
  const partidosRivales = await PartidoRival.find({ equipo: equipoId });

  const tabla = {};

  function asegurarEquipo(nombre, escudo, esUsuario = false) {
    if (!tabla[nombre]) {
      tabla[nombre] = {
        nombre, escudo, esUsuario,
        pj: 0, pg: 0, pe: 0, pp: 0,
        gf: 0, gc: 0, dg: 0, pts: 0,
      };
    }
  }

  asegurarEquipo(nombreEquipoUsuario, escudoUsuario, true);
  rivalesFuturos
    .filter(r => r.competicion === nombreCompeticion)
    .forEach(r => asegurarEquipo(r.rival, r.escudo));

  for (const partido of partidosLiga) {
    asegurarEquipo(partido.rival, partido.escudo);

    const { golesPropios, golesRival } = partido.resultado;

    const tu = tabla[nombreEquipoUsuario];
    const riv = tabla[partido.rival];

    tu.pj++; riv.pj++;
    tu.gf += golesPropios; tu.gc += golesRival;
    riv.gf += golesRival; riv.gc += golesPropios;

    if (golesPropios > golesRival) {
      tu.pg++; tu.pts += 3;
      riv.pp++;
    } else if (golesPropios < golesRival) {
      riv.pg++; riv.pts += 3;
      tu.pp++;
    } else {
      tu.pe++; tu.pts += 1;
      riv.pe++; riv.pts += 1;
    }
  }

  for (const pr of partidosRivales) {
    const a = tabla[pr.equipoA];
    const b = tabla[pr.equipoB];
    if (!a || !b) continue;

    a.pj++; b.pj++;
    a.gf += pr.golesA; a.gc += pr.golesB;
    b.gf += pr.golesB; b.gc += pr.golesA;

    if (pr.golesA > pr.golesB) { a.pg++; a.pts += 3; b.pp++; }
    else if (pr.golesA < pr.golesB) { b.pg++; b.pts += 3; a.pp++; }
    else { a.pe++; a.pts += 1; b.pe++; b.pts += 1; }
  }

  const clasificacion = Object.values(tabla).map(e => ({ ...e, dg: e.gf - e.gc }));

  clasificacion.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);

  return clasificacion.map((e, i) => ({ ...e, posicion: i + 1 }));
}

module.exports = { calcularClasificacionLiga };