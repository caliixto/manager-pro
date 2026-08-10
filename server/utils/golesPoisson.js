// utils/golesPoisson.js
function golesAleatorios(expectativa) {
  let goles = 0;
  let lambda = Math.max(expectativa, 0.1);
  let p = Math.exp(-lambda);
  let acumulado = p;
  let r = Math.random();
  while (acumulado < r && goles < 8) {
    goles++;
    p *= lambda / goles;
    acumulado += p;
  }
  return goles;
}

module.exports = { golesAleatorios };