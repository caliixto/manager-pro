const Partido = require("../models/partido");

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

module.exports = {
  crearPartido,
  listarPartidos,
  obtenerProximoPartido,
  obtenerUltimosResultados,
  editarPartido,
  eliminarPartido
};