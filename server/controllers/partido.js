const Partido = require("../models/partido");
const Jugador = require("../models/player");
const {seleccionarTitulares,puedeJugarPartido} = require("../utils/generarEquipoInicial");

const crearPartido = async (req, res) => {
  try {
    const { rival, fecha, lugar, formacionRival } = req.body;
    const equipo = req.user.id;

    const nuevoPartido = new Partido({ rival, fecha, lugar, formacionRival, equipo });
    await nuevoPartido.save();

    return res.status(201).json({
      status: "success",
      mensaje: "Partido creado correctamente",
      partido: nuevoPartido
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const listarPartidos = async (req, res) => {
  try {
    const equipo = req.user.id;
    const partidos = await Partido.find({ equipo }).sort({ fecha: 1 }); // ordenados por fecha ascendente

    return res.json({ status: "success", total: partidos.length, partidos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

// El próximo partido pendiente (jugado: false), el más cercano en fecha
const obtenerProximoPartido = async (req, res) => {
  try {
    const equipo = req.user.id;
    const proximoPartido = await Partido.findOne({ 
      equipo, 
      jugado: false,
      fecha: { $gte: new Date() } // solo fechas futuras o de hoy
    }).sort({ fecha: 1 });

    return res.json({ status: "success", partido: proximoPartido });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

// Los últimos N partidos jugados, más recientes primero
const obtenerUltimosResultados = async (req, res) => {
  try {
    const equipo = req.user.id;
    const limite = parseInt(req.query.limite) || 5;

    const resultados = await Partido.find({ equipo, jugado: true })
      .sort({ fecha: -1 })
      .limit(limite);

    return res.json({ status: "success", resultados });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const editarPartido = async (req, res) => {
  try {
    const { id } = req.params;
    const partidoActualizado = await Partido.findByIdAndUpdate(id, req.body, { new: true });

    if (!partidoActualizado) {
      return res.status(404).json({ status: "error", message: "Partido no encontrado" });
    }

    return res.json({ status: "success", mensaje: "Partido actualizado correctamente", partido: partidoActualizado });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const eliminarPartido = async (req, res) => {
  try {
    const { id } = req.params;
    const partidoEliminado = await Partido.findByIdAndDelete(id);

    if (!partidoEliminado) {
      return res.status(404).json({ status: "error", message: "Partido no encontrado" });
    }

    return res.json({ status: "success", mensaje: "Partido eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const generarConvocatoria = async (req, res) => {
  try {
    const { id } = req.params
    const equipo = req.user.id;

    const jugadoresDisponibles = await Jugador.find({
      equipo,
      lesionado: false,
      sancionado: false
    });

    const idsConvocados = jugadoresDisponibles.map(j => j._id);

    const partidoActualizado = await Partido.findByIdAndUpdate(
      id,
      { convocados: idsConvocados },
      { new: true }
    );

    if (!partidoActualizado) {
      return res.status(404).json({ status: "error", message: "Partido no encontrado" });
    }

    return res.json({
      status: "success",
      mensaje: "Convocatoria generada correctamente",
      totalConvocados: idsConvocados.length,
      partido: partidoActualizado
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const obtenerBalanceTactico = async (req, res) => {
  try {
    const { id } = req.params;
    const partido = await Partido.findById(id).populate('convocados');

    if (!partido || !partido.convocados || partido.convocados.length === 0) {
      return res.json({ 
        status: "success", 
        balance: { ataque: 0, defensa: 0, control: 0 },
        alerta: "Sin jugadores convocados"
      });
    }

    const totalDisponibles = partido.convocados.length;

    // Caso crítico: menos de 7 disponibles, no se puede jugar
    if (!puedeJugarPartido(totalDisponibles)) {
      return res.json({
        status: "success",
        balance: { ataque: 0, defensa: 0, control: 0 },
        alerta: "Plantilla insuficiente para jugar (menos de 7 disponibles). El partido se perdería por incomparecencia.",
        jugablePartido: false
      });
    }

    const titulares = seleccionarTitulares(partido.convocados);
    const total = titulares.length;

    const suma = titulares.reduce((acc, j) => {
      acc.ataque += (j.stats.tiro + j.stats.regate + j.stats.aceleracion + j.stats.posicionamiento) / 4;
      acc.defensa += (j.stats.defensa + j.stats.fisico + j.stats.determinacion) / 3;
      acc.control += (j.stats.pase + j.stats.vision + j.stats.resistencia) / 3;
      return acc;
    }, { ataque: 0, defensa: 0, control: 0 });

    const balance = {
      ataque: Math.round(suma.ataque / total),
      defensa: Math.round(suma.defensa / total),
      control: Math.round(suma.control / total),
    };

    return res.json({ 
      status: "success", 
      balance,
      totalTitulares: total,
      jugablePartido: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const obtenerTitulares = async (req, res) => {
  try {
    const { id } = req.params;
    const partido = await Partido.findById(id).populate('convocados');

    if (!partido || !partido.convocados || partido.convocados.length === 0) {
      return res.json({ status: "success", titulares: [] });
    }

    const titulares = seleccionarTitulares(partido.convocados);

    return res.json({ status: "success", titulares });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};


module.exports = {
  crearPartido,
  listarPartidos,
  obtenerProximoPartido,
  obtenerUltimosResultados,
  editarPartido,
  eliminarPartido,
  generarConvocatoria,
  obtenerBalanceTactico,
  obtenerTitulares
};