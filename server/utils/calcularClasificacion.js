const Partido = require('../models/partido');
const Users = require('../models/users');

async function calcularClasificacionLiga(equipoId) {
  const usuario = await Users.findById(equipoId);
  const nombreEquipoUsuario = usuario?.NOMBRE_CAMPO_AQUI || 'Equipo Default';
  const escudoUsuario = usuario?.NOMBRE_CAMPO_ESCUDO_AQUI || '/img/miteam.webp';
  const partidosLiga = await Partido.find({
    equipo: equipoId,
    competicion: 'liga',
    jugado: true,
  });

  const tabla = {};

  function asegurarEquipo(nombre, escudo) {
    if (!tabla[nombre]) {
      tabla[nombre] = {
        nombre, escudo,
        pj: 0, pg: 0, pe: 0, pp: 0,
        gf: 0, gc: 0, dg: 0, pts: 0,
      };
    }
  }

  asegurarEquipo(nombreEquipoUsuario, escudoUsuario, true);
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

  const clasificacion = Object.values(tabla).map(e => ({ ...e, dg: e.gf - e.gc }));

  
  clasificacion.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);

  return clasificacion.map((e, i) => ({ ...e, posicion: i + 1 }));
}

module.exports = { calcularClasificacionLiga };