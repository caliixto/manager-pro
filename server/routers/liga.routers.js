
router.get('/liga/clasificacion', verificarToken, async (req, res) => {
  try {
    const clasificacion = await calcularClasificacionLiga(req.user.id, '2026-2027');
    return res.json({ status: 'success', clasificacion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Error al calcular la clasificación' });
  }
});