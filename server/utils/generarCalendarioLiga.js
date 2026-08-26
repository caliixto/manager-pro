const TU_EQUIPO = '6a6aa10d476a773c66717b76';

/**
 * Algoritmo del "método del círculo": genera un calendario round-robin
 * de ida y vuelta para un número PAR de equipos.
 * Devuelve un array de rondas, cada ronda con los enfrentamientos { local, visitante }.
 */
function generarRoundRobinDoble(equipos) {
  const n = equipos.length;
  if (n % 2 !== 0) throw new Error('El número de equipos debe ser par');

  const rondas = n - 1;
  const mitad = n / 2;
  let lista = equipos.slice();
  const primeraVuelta = [];

  for (let ronda = 0; ronda < rondas; ronda++) {
    const partidosRonda = [];
    for (let i = 0; i < mitad; i++) {
      const equipoA = lista[i];
      const equipoB = lista[n - 1 - i];
      if (ronda % 2 === 0) {
        partidosRonda.push({ local: equipoA, visitante: equipoB });
      } else {
        partidosRonda.push({ local: equipoB, visitante: equipoA });
      }
    }
    primeraVuelta.push(partidosRonda);

    const fijo = lista[0];
    const resto = lista.slice(1);
    resto.unshift(resto.pop());
    lista = [fijo, ...resto];
  }

  const segundaVuelta = primeraVuelta.map(ronda =>
    ronda.map(p => ({ local: p.visitante, visitante: p.local }))
  );

  return [...primeraVuelta, ...segundaVuelta];
}

/**
 * Genera las fechas de la temporada, repartidas semanalmente
 * desde mediados de agosto hasta finales de mayo.
 */
function generarFechasTemporada(numeroJornadas) {
  const hoy = new Date();
  let inicioTemporada = new Date(hoy.getFullYear(), 7, 15);

  if (hoy > inicioTemporada) {
    inicioTemporada = new Date(hoy.getFullYear() + 1, 7, 15);
  }

  const fechas = [];
  for (let i = 0; i < numeroJornadas; i++) {
    const fecha = new Date(inicioTemporada);
    fecha.setDate(fecha.getDate() + i * 7);
    fechas.push(fecha);
  }
  return fechas;
}

/**
 * Genera el calendario COMPLETO: tus partidos + los cruces entre rivales,
 * todos derivados del mismo round-robin, para que nunca se descoordinen.
 */
function generarCalendarioCompleto(rivalesLiga) {
  const nombresRivales = rivalesLiga.map(r => r.rival);
  const equipos = [TU_EQUIPO, ...nombresRivales];
  const todasLasJornadas = generarRoundRobinDoble(equipos);
  const fechas = generarFechasTemporada(todasLasJornadas.length);

  const partidosUsuario = [];
  const cruceRivales = [];

  todasLasJornadas.forEach((jornada, indiceJornada) => {
    const numeroJornada = indiceJornada + 1;

    jornada.forEach(partido => {
      const esDelUsuario = partido.local === TU_EQUIPO || partido.visitante === TU_EQUIPO;

      if (esDelUsuario) {
        const esLocal = partido.local === TU_EQUIPO;
        const nombreRival = esLocal ? partido.visitante : partido.local;
        const infoRival = rivalesLiga.find(r => r.rival === nombreRival);

        partidosUsuario.push({
          rival: nombreRival,
          escudo: infoRival.escudo,
          formacion: infoRival.formacion,
          lugar: esLocal ? 'casa' : 'fuera',
          fecha: fechas[indiceJornada],
          jornada: numeroJornada,
        });
      } else {
        const infoA = rivalesLiga.find(r => r.rival === partido.local);
        const infoB = rivalesLiga.find(r => r.rival === partido.visitante);

        cruceRivales.push({
          jornada: numeroJornada,
          equipoA: partido.local,
          escudoA: infoA.escudo,
          equipoB: partido.visitante,
          escudoB: infoB.escudo,
        });
      }
    });
  });

  return { partidosUsuario, cruceRivales };
}

module.exports = {
  generarRoundRobinDoble,
  generarFechasTemporada,
  generarCalendarioCompleto,
};