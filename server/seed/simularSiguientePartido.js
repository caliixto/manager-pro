// seed/simularSiguientePartido.js
const mongoose = require('mongoose');
require('dotenv').config();
const { simularSiguientePartido } = require('../utils/simularPartido');

const EQUIPO_ID = '6a6aa10d476a773c66717b76';

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Conectado a MongoDB');

  const resultado = await simularSiguientePartido(EQUIPO_ID);

  console.log(`\n⚽ vs ${resultado.rival}`);
  console.log(`Resultado: ${resultado.resultado}`);
  console.log(`Nivel equipo: ${resultado.nivelEquipo} | Nivel rival: ${resultado.nivelRival}`);
  console.log('Goleadores:', resultado.goleadores.join(', ') || 'Nadie marcó');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});