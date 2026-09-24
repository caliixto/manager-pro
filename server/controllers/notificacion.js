const Notificacion = require('../models/notificacion');
const Users = require('../models/users');

const obtenerNotificaciones = async (req, res) => {
  try {
    const equipoId = req.user.id;
    const notificaciones = await Notificacion.find({ equipo: equipoId, reclamada: false })
      .sort({ fecha: -1 });

    return res.json({ status: 'success', notificaciones });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
};

const reclamarTodas = async (req, res) => {
  try {
    const equipoId = req.user.id;

    const pendientes = await Notificacion.find({ equipo: equipoId, reclamada: false });

    if (pendientes.length === 0) {
      const user = await Users.findById(equipoId);
      return res.json({ status: 'success', mensaje: 'No hay nada pendiente', monedasActuales: user.monedas, totalReclamado: 0 });
    }

    const totalReclamado = pendientes.reduce((acc, n) => acc + n.monto, 0);

    const usuarioActualizado = await Users.findByIdAndUpdate(
      equipoId,
      { $inc: { monedas: totalReclamado } },
      { new: true }
    );

    await Notificacion.updateMany(
      { equipo: equipoId, reclamada: false },
      { reclamada: true }
    );

    return res.json({
      status: 'success',
      mensaje: 'Recompensas reclamadas correctamente',
      totalReclamado,
      monedasActuales: usuarioActualizado.monedas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
};

module.exports = { obtenerNotificaciones, reclamarTodas };