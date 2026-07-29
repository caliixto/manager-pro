const Participacion = require("../models/participacion");

// Trae las estadísticas agregadas de un jugador concreto (goles totales, partidos, tarjetas...)
const obtenerEstadisticasJugador = async (req, res) => {
  try {
    const { jugadorId } = req.params;

    const participaciones = await Participacion.find({ jugador: jugadorId }).populate('partido');

    const totales = participaciones.reduce((acc, p) => {
      acc.partidosJugados += 1;
      acc.goles += p.goles;
      acc.asistencias += p.asistencias;
      acc.tarjetasAmarillas += p.tarjetaAmarilla ? 1 : 0;
      acc.tarjetasRojas += p.tarjetaRoja ? 1 : 0;
      acc.minutosTotales += p.minutosJugados;
      return acc;
    }, { partidosJugados: 0, goles: 0, asistencias: 0, tarjetasAmarillas: 0, tarjetasRojas: 0, minutosTotales: 0 });

    return res.json({ 
      status: "success", 
      estadisticas: totales,
      historial: participaciones 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

// Crea un registro de participación (por ahora, lo harás manualmente en Postman para probar)
const registrarParticipacion = async (req, res) => {
  try {
    const { jugador, partido, titular, minutosJugados, goles, asistencias, tarjetaAmarilla, tarjetaRoja } = req.body;

    const nuevaParticipacion = new Participacion({
      jugador, partido, titular, minutosJugados, goles, asistencias, tarjetaAmarilla, tarjetaRoja
    });
    await nuevaParticipacion.save();

    return res.status(201).json({ status: "success", mensaje: "Participación registrada", participacion: nuevaParticipacion });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

module.exports = { obtenerEstadisticasJugador, registrarParticipacion };