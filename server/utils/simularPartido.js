// utils/simularPartido.js
const Jugador = require('../models/player');
const Partido = require('../models/partido');
const Users = require('../models/users');
const Participacion = require('../models/participacion');
const { obtenerNivelRival} = require('./generarEquipoInicial');
const { simularJornadaEntreRivales } = require('./simularJornadaRivales');
const { golesAleatorios } = require('./golesPoisson');
const { calcularPremioPartido } = require('./calcularPremio');
const { progresionTrasPartido } = require('./progresionJugador');
const Notificacion = require('../models/notificacion');


// Nivel de un jugador: media de sus 12 stats
function calcularNivelJugador(jugador) {
  const s = jugador.stats;
  const valores = Object.values(s);
  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

const descuentoPrimeraParte = Math.floor(Math.random() * 7);
const descuentoSegundaParte = Math.floor(Math.random() * 7);

// Genera un minuto aleatorio no repetido dentro de 1-90, evitando choques con los ya usados
function minutoAleatorioUnico(minutosUsados) {
  let minuto;
  do {
    minuto = Math.floor(Math.random() * 90) + 1;
  } while (minutosUsados.has(minuto));
  minutosUsados.add(minuto);
  return minuto;
}

const COMENTARIOS_REMATE_FUERA = [
  '{jugador} lo intenta desde fuera del área, pero se marcha alto.',
  'Disparo de {jugador} que se va desviado.',
  '{jugador} busca el ángulo, pero el balón se pierde por la línea de fondo.',
];

const COMENTARIOS_PARADA = [
  '¡Gran parada del portero rival a disparo de {jugador}!',
  '{jugador} remata y el guardameta responde con una estirada providencial.',
  'El portero rival se luce ante el disparo de {jugador}.',
];

function elegirAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

async function simularSiguientePartido(equipoId) {
  console.log('🟢 INICIO simularSiguientePartido, equipoId:', equipoId);
  // 1. Buscamos el próximo partido sin jugar, el más cercano en fecha
  const partido = await Partido.findOne({ equipo: equipoId, jugado: false })
    .sort({ fecha: 1 });

  if (!partido) {
    throw new Error('No hay partidos pendientes en el calendario');
  }


  // 2. Determinamos titulares: partimos de la alineación guardada por el usuario,
  // sustituyendo automáticamente a quien esté lesionado, sancionado o con energía muy baja
  const UMBRAL_ENERGIA_MINIMA = 20; // por debajo de esto, no puede jugar si hay alternativa

  const equipo = await Users.findById(equipoId).populate('alineacion');
  const todaLaPlantilla = await Jugador.find({ equipo: equipoId });

  const idsSancionadosAntes = todaLaPlantilla
    .filter(j => j.sancionado)
    .map(j => j._id.toString());

  const idsConvocados = new Set((partido.convocados || []).map(id => id.toString()));
  const hayConvocatoria = idsConvocados.size > 0;

  const puedeJugar = (jugador) =>
  jugador && !jugador.lesionado && !jugador.sancionado && jugador.resistencia >= UMBRAL_ENERGIA_MINIMA &&
  (!hayConvocatoria || idsConvocados.has(jugador._id.toString()));

  let titulares = [];
  const usados = new Set();
  const sustituciones = []; // solo para el log, no afecta a la lógica

  const alineacionGuardada = equipo?.alineacion?.length === 11 ? equipo.alineacion : null;

  if (alineacionGuardada) {
    for (const jugadorGuardado of alineacionGuardada) {
      // el jugador puede haber cambiado de estado desde que se guardó la alineación
      const jugadorActual = todaLaPlantilla.find(j => j._id.toString() === jugadorGuardado._id.toString());

      if (jugadorActual && puedeJugar(jugadorActual)) {
        titulares.push(jugadorActual);
        usados.add(jugadorActual._id.toString());
      } else {
        const suplente = todaLaPlantilla.find(j =>
          j.posicion === jugadorGuardado.posicion &&
          !usados.has(j._id.toString()) &&
          puedeJugar(j)
        );

        if (suplente) {
          titulares.push(suplente);
          usados.add(suplente._id.toString());
          sustituciones.push(`${jugadorActual?.nombre ?? '???'} (resistencia ${jugadorActual?.resistencia ?? '?'}) → ${suplente.nombre}`);
        } else if (jugadorActual) {
          // No hay ningún suplente disponible en esa posición: juega igualmente (regla FIFA de mínimos)
          titulares.push(jugadorActual);
          usados.add(jugadorActual._id.toString());
        }
      }
    }
  }

  // Red de seguridad: sin alineación guardada (o incompleta), reparto automático como antes
  if (titulares.length < 7) {
    const disponibles = todaLaPlantilla.filter(puedeJugar);
    const porteros = disponibles.filter(j => j.posicion === 'POR');
    const defensas = disponibles.filter(j => j.posicion === 'DEF');
    const centros = disponibles.filter(j => j.posicion === 'CEN');
    const delanteros = disponibles.filter(j => j.posicion === 'DEL');

    titulares = [
      ...porteros.slice(0, 1),
      ...defensas.slice(0, 4),
      ...centros.slice(0, 3),
      ...delanteros.slice(0, 3),
    ];
  }

  if (sustituciones.length > 0) {
    console.log('🔄 Sustituciones automáticas por energía/lesión/sanción:', sustituciones);
  }

  if (titulares.length < 7) {
    throw new Error('No hay suficientes jugadores disponibles (mínimo 7, regla FIFA)');
  }

  // 3. Calculamos nivel medio de tu equipo vs nivel del rival
  const nivelEquipo = titulares.reduce((acc, j) => acc + calcularNivelJugador(j), 0) / titulares.length;
  const nivelRival = obtenerNivelRival(partido.rival, partido.liga);
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

  const registrosGol = {};
  const registrosAsist = {};
  const minutosUsados = new Set();
  const eventos = [];

  for (let i = 0; i < golesPropios; i++) {
    const goleador = elegirJugadorPonderado(titulares, pesoGol);
    registrosGol[goleador._id] = (registrosGol[goleador._id] ?? 0) + 1;

    let asistente = null;
    if (Math.random() < 0.6) {
      const candidatosAsist = titulares.filter(j => j._id.toString() !== goleador._id.toString());
      asistente = elegirJugadorPonderado(candidatosAsist, pesoGol);
      registrosAsist[asistente._id] = (registrosAsist[asistente._id] ?? 0) + 1;
    }

    const minuto = minutoAleatorioUnico(minutosUsados);
    eventos.push({
      minuto,
      tipo: 'gol',
      jugador: goleador.nombre,
      asistencia: asistente ? asistente.nombre : undefined,
      equipo: 'propio',
      descripcion: asistente
        ? `¡GOOOL! ${goleador.nombre} marca, asistido por ${asistente.nombre}.`
        : `¡GOOOL! ${goleador.nombre} marca para el equipo.`
    });
  }

  // Goles del rival: sin jugador concreto, ya que no simulamos su plantilla jugada a jugada
  for (let i = 0; i < golesRival; i++) {
    const minuto = minutoAleatorioUnico(minutosUsados);
    eventos.push({
      minuto,
      tipo: 'gol',
      jugador: partido.rival,
      equipo: 'rival',
      descripcion: `Gol del ${partido.rival}. Empieza a complicarse el partido.`
    });
  }

  // 5. Tarjetas: simulamos evento a evento, respetando que un expulsado no genera más tarjetas
  const jugadoresExpulsados = new Set();
  const jugadoresConAmarilla = new Set(); // quién ya tiene 1 amarilla, para la 2ª->roja

  // Generamos los "intentos" de tarjeta con su minuto, y los procesamos en orden cronológico
  const intentosDeTarjeta = [];

  for (const jugador of titulares) {
    const probAmarilla = jugador.posicion === 'DEF' ? 0.18 : jugador.posicion === 'CEN' ? 0.12 : 0.06;
    const probRojaDirecta = 0.015; // pequeña probabilidad, independiente de las amarillas

    if (Math.random() < probAmarilla) {
      intentosDeTarjeta.push({ jugador, minuto: minutoAleatorioUnico(minutosUsados), tipo: 'amarilla' });
    }
    if (Math.random() < probRojaDirecta) {
      intentosDeTarjeta.push({ jugador, minuto: minutoAleatorioUnico(minutosUsados), tipo: 'roja_directa' });
    }
    // Pequeña probabilidad de UNA SEGUNDA amarilla en el mismo partido (poco común, pero realista)
    if (Math.random() < probAmarilla * 0.25) {
      intentosDeTarjeta.push({ jugador, minuto: minutoAleatorioUnico(minutosUsados), tipo: 'amarilla' });
    }
  }

  intentosDeTarjeta.sort((a, b) => a.minuto - b.minuto);

  const registrosTarjetas = {}; // jugadorId -> { amarilla: bool, roja: bool }

  for (const intento of intentosDeTarjeta) {
    const idJugador = intento.jugador._id.toString();

    // Si ya está expulsado, ignoramos cualquier intento posterior de tarjeta
    if (jugadoresExpulsados.has(idJugador)) continue;

    if (!registrosTarjetas[idJugador]) {
      registrosTarjetas[idJugador] = { amarilla: false, roja: false };
    }

    if (intento.tipo === 'roja_directa') {
      registrosTarjetas[idJugador].roja = true;
      jugadoresExpulsados.add(idJugador);
      eventos.push({
        minuto: intento.minuto,
        tipo: 'roja',
        jugador: intento.jugador.nombre,
        equipo: 'propio',
        descripcion: `¡Tarjeta roja directa para ${intento.jugador.nombre}! Se queda con diez.`
      });
      continue;
    }

    // Es una amarilla
    if (jugadoresConAmarilla.has(idJugador)) {
      // Es su SEGUNDA amarilla → expulsión automática
      registrosTarjetas[idJugador].roja = true;
      jugadoresExpulsados.add(idJugador);
      eventos.push({
        minuto: intento.minuto,
        tipo: 'amarilla',
        jugador: intento.jugador.nombre,
        equipo: 'propio',
        descripcion: `Segunda amarilla para ${intento.jugador.nombre}.`
      });
      eventos.push({
        minuto: intento.minuto,
        tipo: 'roja',
        jugador: intento.jugador.nombre,
        equipo: 'propio',
        descripcion: `¡${intento.jugador.nombre} ve la roja tras la doble amarilla! Se queda con diez.`
      });
    } else {
      // Primera amarilla del partido para este jugador
      jugadoresConAmarilla.add(idJugador);
      registrosTarjetas[idJugador].amarilla = true;
      eventos.push({
        minuto: intento.minuto,
        tipo: 'amarilla',
        jugador: intento.jugador.nombre,
        equipo: 'propio',
        descripcion: `Tarjeta amarilla para ${intento.jugador.nombre}.`
      });
    }
  }

  const participaciones = titulares.map(jugador => {
    const idJugador = jugador._id.toString();
    const tarjetas = registrosTarjetas[idJugador] ?? { amarilla: false, roja: false };

    return {
      jugador: jugador._id,
      partido: partido._id,
      goles: registrosGol[jugador._id] ?? 0,
      asistencias: registrosAsist[jugador._id] ?? 0,
      tarjetaAmarilla: tarjetas.amarilla,
      tarjetaRoja: tarjetas.roja,
      minutosJugados: 90,
    };
  });

  // Eventos de "ambiente" sin efecto en el marcador, para rellenar el partido
  const numEventosRelleno = Math.floor(Math.random() * 7) + 8;
  for (let i = 0; i < numEventosRelleno; i++) {
    const candidatosRelleno = titulares.filter(j => !jugadoresExpulsados.has(j._id.toString()));
    if (candidatosRelleno.length === 0) break;

    const jugador = elegirJugadorPonderado(candidatosRelleno, pesoGol);
    const minuto = minutoAleatorioUnico(minutosUsados);
    const esParada = Math.random() < 0.5;

    const plantilla = esParada ? elegirAleatorio(COMENTARIOS_PARADA) : elegirAleatorio(COMENTARIOS_REMATE_FUERA);

    eventos.push({
      minuto,
      tipo: esParada ? 'parada' : 'remate_fuera',
      jugador: jugador.nombre,
      equipo: 'propio',
      descripcion: plantilla.replace('{jugador}', jugador.nombre)
    });
  }

  // Ordenamos todos los eventos cronológicamente
  eventos.sort((a, b) => a.minuto - b.minuto);

  await Participacion.insertMany(participaciones);

  // 5.5. Calculamos el premio y lo dejamos como notificación PENDIENTE (no se suma aún a las monedas)
  const premio = calcularPremioPartido({
    nivelRival,
    competicion: partido.competicion,
    golesPropios,
    golesRival,
  });

  const tipoResultado = golesPropios > golesRival ? 'Victoria' : golesPropios === golesRival ? 'Empate' : 'Derrota';
  const mensajePremio = `${tipoResultado} vs ${partido.rival} (${golesPropios}-${golesRival}): +${premio.toLocaleString('es-ES')} monedas`;

  await Notificacion.create({
    equipo: equipoId,
    tipo: 'premio_partido',
    mensaje: mensajePremio,
    monto: premio,
  });

  const usuarioActualizado = equipo;

  // 6. Actualizamos el Partido con el resultado real
  partido.jugado = true;
  partido.resultado = { golesPropios, golesRival };
  partido.convocados = titulares.map(j => j._id);
  partido.eventos = eventos;
  await partido.save();

  console.log('🟡 A PUNTO de actualizar resistencia');

    // 6.5. Actualizamos resistencia de TODA la plantilla (jugaron vs. descansaron)
  const idsTitulares = titulares.map(j => j._id.toString());

  const partidoAnterior = await Partido.findOne({
    equipo: equipoId,
    jugado: true,
    fecha: { $lt: partido.fecha },
    _id: { $ne: partido._id }
  }).sort({ fecha: -1 });

  let diasDescanso = 4; // valor por defecto si es el primer partido jugado
  if (partidoAnterior) {
    const msPorDia = 1000 * 60 * 60 * 24;
    diasDescanso = Math.round((partido.fecha - partidoAnterior.fecha) / msPorDia);
  }

  const actualizacionesResistencia = todaLaPlantilla.map(jugador => {
    const jugo = idsTitulares.includes(jugador._id.toString());
    let nuevaResistencia;

    if (jugo) {
      const desgaste = Math.floor(Math.random() * 11) + 15; // entre 15 y 25
      nuevaResistencia = Math.max(0, jugador.resistencia - desgaste);
    } else {
      const recuperacion = diasDescanso * 10;
      nuevaResistencia = Math.min(100, jugador.resistencia + recuperacion);
    }

    return Jugador.findByIdAndUpdate(jugador._id, { resistencia: nuevaResistencia });
  });

  await Promise.all(actualizacionesResistencia);

  // 6.6. Progresión de stats para los titulares que jugaron
    // 6.6. Progresión de stats para los titulares que jugaron
  const progresiones = []; // ← nuevo: guardamos qué mejoró, para mostrarlo después

  const actualizacionesProgresion = titulares.map(jugador => {
    const hizoGol = (registrosGol[jugador._id] ?? 0) > 0;
    const dioAsistencia = (registrosAsist[jugador._id] ?? 0) > 0;

    const statsAntes = { ...jugador.stats };
    const nuevasStats = progresionTrasPartido(jugador, { hizoGol, dioAsistencia });

    // Detectamos qué stats concretas subieron, para el aviso
    const statsQueSubieron = Object.keys(nuevasStats).filter(
      stat => nuevasStats[stat] > statsAntes[stat]
    );

    if (statsQueSubieron.length > 0) {
      progresiones.push({
        jugador: jugador.nombre,
        stats: statsQueSubieron.map(stat => ({
          nombre: stat,
          antes: statsAntes[stat],
          despues: nuevasStats[stat],
        })),
      });
    }

    return Jugador.findByIdAndUpdate(jugador._id, { stats: nuevasStats });
  });

  await Promise.all(actualizacionesProgresion);

    // 6.7. Gestión de sanciones: quita la sanción a quien ya la cumplió (se perdió este partido),
  // y sanciona a quien haya visto roja en este partido para el próximo
  const idsConRojaEsteFartido = participaciones
    .filter(p => p.tarjetaRoja)
    .map(p => p.jugador.toString());

  const actualizacionesSancion = [];

  for (const id of idsSancionadosAntes) {
    actualizacionesSancion.push(Jugador.findByIdAndUpdate(id, { sancionado: false }));
  }

  for (const id of idsConRojaEsteFartido) {
    actualizacionesSancion.push(Jugador.findByIdAndUpdate(id, { sancionado: true }));
  }

  if (actualizacionesSancion.length > 0) {
    await Promise.all(actualizacionesSancion);
  }

    // 7. Estadísticas del partido (estilo FIFA/eFootball) — para descanso y resumen final
  const remateFueraPropio = eventos.filter(e => e.tipo === 'remate_fuera' && e.equipo === 'propio').length;
  const paradasRivalContraNosotros = eventos.filter(e => e.tipo === 'parada' && e.equipo === 'propio').length; // paradas del portero RIVAL

  const tirosPuertaPropios = golesPropios + paradasRivalContraNosotros;
  const disparosPropios = tirosPuertaPropios + remateFueraPropio;

  const paradasPropias = Math.round(Math.random() * 4); // paradas de NUESTRO portero ante el rival
  const remateFueraRival = Math.round(Math.random() * 6);
  const tirosPuertaRival = golesRival + paradasPropias;
  const disparosRival = tirosPuertaRival + remateFueraRival;

  const cornersPropios = Math.round(Math.random() * 7 + 2);
  const cornersRival = Math.round(Math.random() * 7 + 2);
  const faltasPropias = Math.round(Math.random() * 9 + 3);
  const faltasRival = Math.round(Math.random() * 9 + 3);
  const fueraDeJuegoPropio = Math.round(Math.random() * 3);
  const fueraDeJuegoRival = Math.round(Math.random() * 3);

  const amarillasPropias = Object.values(registrosTarjetas).filter(t => t.amarilla).length;
  const rojasPropias = Object.values(registrosTarjetas).filter(t => t.roja).length;
  const amarillasRival = Math.random() < 0.75 ? Math.round(Math.random() * 3) : 0;
  const rojasRival = Math.random() < 0.07 ? 1 : 0;

  let posesionPropia = 50 + Math.round(diferencia / 3);
  posesionPropia = Math.min(68, Math.max(32, posesionPropia));

  const estadisticas = {
    propio: {
      disparos: disparosPropios, tirosPuerta: tirosPuertaPropios,
      corners: cornersPropios, faltas: faltasPropias, fueraDeJuego: fueraDeJuegoPropio,
      amarillas: amarillasPropias, rojas: rojasPropias, posesion: posesionPropia,
    },
    rival: {
      disparos: disparosRival, tirosPuerta: tirosPuertaRival,
      corners: cornersRival, faltas: faltasRival, fueraDeJuego: fueraDeJuegoRival,
      amarillas: amarillasRival, rojas: rojasRival, posesion: 100 - posesionPropia,
    }
  };

  // Snapshot aproximado a mitad de partido (los goles/tarjetas salen exactos de los eventos, el resto se prorratea)
  const corte1P = 45 + descuentoPrimeraParte;
  const factorMitad = () => 0.38 + Math.random() * 0.24;

  const amarillasPropias1P = intentosDeTarjeta.filter(t => t.tipo === 'amarilla' && t.minuto <= corte1P).length;
  const rojasPropias1P = intentosDeTarjeta.filter(t => t.tipo === 'roja_directa' && t.minuto <= corte1P).length;

  const estadisticasPrimeraParte = {
    propio: {
      disparos: Math.round(disparosPropios * factorMitad()),
      tirosPuerta: Math.round(tirosPuertaPropios * factorMitad()),
      corners: Math.round(cornersPropios * factorMitad()),
      faltas: Math.round(faltasPropias * factorMitad()),
      fueraDeJuego: Math.round(fueraDeJuegoPropio * factorMitad()),
      amarillas: amarillasPropias1P, rojas: rojasPropias1P,
      posesion: posesionPropia,
    },
    rival: {
      disparos: Math.round(disparosRival * factorMitad()),
      tirosPuerta: Math.round(tirosPuertaRival * factorMitad()),
      corners: Math.round(cornersRival * factorMitad()),
      faltas: Math.round(faltasRival * factorMitad()),
      fueraDeJuego: Math.round(fueraDeJuegoRival * factorMitad()),
      amarillas: 0, rojas: 0,
      posesion: 100 - posesionPropia,
    }
  };

  console.log('--- Resistencia actualizada ---');
  todaLaPlantilla.forEach(j => {
    const jugo = idsTitulares.includes(j._id.toString());
    console.log(`${j.nombre} (${j.posicion}) — ${jugo ? 'JUGÓ' : 'descansó'} — resistencia previa: ${j.resistencia}`);
  });
  console.log(`Días de descanso calculados: ${diasDescanso}`);

 if (partido.competicion === 'liga') {
  console.log('🟣 Jornada del partido que se acaba de jugar:', partido.jornada);
  await simularJornadaEntreRivales(equipoId, partido.jornada);
}

  return {
    rival: partido.rival,
    escudoRival: partido.escudo,
    resultado: `${golesPropios} - ${golesRival}`,
    nivelEquipo: Math.round(nivelEquipo),
    nivelRival,
    eventos,
    descuentoPrimeraParte,
    descuentoSegundaParte,
    premio,
    monedasActuales: usuarioActualizado.monedas,
    progresiones,
    estadisticas,              // ← nuevo
    estadisticasPrimeraParte,
    goleadores: Object.entries(registrosGol).map(([id, goles]) => {
      const j = titulares.find(t => t._id.toString() === id);
      return `${j.nombre}: ${goles}`;
    }),
  };
}

module.exports = { simularSiguientePartido };