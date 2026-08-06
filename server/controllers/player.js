const Jugador = require("../models/player");
const mongoose = require("mongoose");

// Crear un jugador nuevo
const crearJugador = async (req, res) => {
  try {
    const { nombre, posicion, edad, dorsal, foto } = req.body;
    const equipo = req.user.id;

    const nuevoJugador = new Jugador({
      nombre,
      posicion,
      edad,
      dorsal,
      foto,
      equipo
    });

    await nuevoJugador.save();

    return res.status(201).json({
      status: "success",
      mensaje: "Jugador creado correctamente",
      jugador: nuevoJugador
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

// Listar todos los jugadores del equipo del coach logueado
const listarJugadores = async (req, res) => {
  try {
    const equipo = req.user.id;
    const jugadores = await Jugador.find({ equipo });

    return res.json({
      status: "success",
      total: jugadores.length,
      jugadores
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

// Obtener un jugador concreto (para la ficha)
const obtenerJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const jugador = await Jugador.findById(id);

    if (!jugador) {
      return res.status(404).json({ status: "error", message: "Jugador no encontrado" });
    }

    return res.json({ status: "success", jugador });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

// Editar un jugador
const editarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const jugadorActualizado = await Jugador.findByIdAndUpdate(id, req.body, { new: true });

    if (!jugadorActualizado) {
      return res.status(404).json({ status: "error", message: "Jugador no encontrado" });
    }

    return res.json({
      status: "success",
      mensaje: "Jugador actualizado correctamente",
      jugador: jugadorActualizado
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

// Eliminar un jugador
const eliminarJugador = async (req, res) => {
  try {
    const { id } = req.params;
    const jugadorEliminado = await Jugador.findByIdAndDelete(id);

    if (!jugadorEliminado) {
      return res.status(404).json({ status: "error", message: "Jugador no encontrado" });
    }

    return res.json({ status: "success", mensaje: "Jugador eliminado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const listarConEstadisticas = async (req, res) => {
  try {
    const equipo = req.user.id;

    const jugadores = await Jugador.aggregate([
      // 1. Filtramos solo los jugadores de tu equipo
      { $match: { equipo: new mongoose.Types.ObjectId(equipo) } },

      // 2. "Unimos" cada jugador con sus participaciones (como un JOIN de SQL)
      {
        $lookup: {
          from: 'participacions', // ⚠️ nombre real de la colección en Mongo, ver nota abajo
          localField: '_id',
          foreignField: 'jugador',
          as: 'participaciones'
        }
      },

      // 3. Calculamos los totales sumando el array de participaciones
      {
        $addFields: {
          partidosJugados: { $size: '$participaciones' },
          goles: { $sum: '$participaciones.goles' },
          asistencias: { $sum: '$participaciones.asistencias' },
          tarjetasAmarillas: {
            $size: {
              $filter: {
                input: '$participaciones',
                cond: { $eq: ['$$this.tarjetaAmarilla', true] }
              }
            }
          },
          tarjetasRojas: {
            $size: {
              $filter: {
                input: '$participaciones',
                cond: { $eq: ['$$this.tarjetaRoja', true] }
              }
            }
          }
        }
      },

      // 4. Quitamos el array completo de participaciones (ya no lo necesitamos, solo los totales)
      { $project: { participaciones: 0 } }
    ]);

    return res.json({
      status: "success",
      total: jugadores.length,
      jugadores
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

module.exports = {
  crearJugador,
  listarJugadores,
  obtenerJugador,
  editarJugador,
  eliminarJugador,
  listarConEstadisticas
};