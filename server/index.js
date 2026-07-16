const connection = require("./database/connection.js");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 1. Conexión a BD
connection();

// 2. Crear el servidor
const app = express();
const port = process.env.PORT || 5000 || '0.0.0.0';


//Cors
const whitelist = [
  'https://manager-50xeljyps-maneger-pro.vercel.app',
  'http://localhost:4200'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
};


// 4. Cargar rutas
const Usersrouter = require("./routers/users");
const Adminrouter = require("./routers/admin");
const authRouter = require("./routers/auth");
const playersRouter = require("./routers/player");
const partidoRouter = require("./routers/partido");

app.use("/api/admin", Adminrouter);
app.use('/api/users', Usersrouter);
app.use("/api/auth", authRouter);
app.use("/api/players",playersRouter);
app.use("/api/partidos", partidoRouter);
// 5. Ruta base
app.get('/', (req, res) => {
    res.send('¡API del ManagerPro funcionando!');
});

app.listen(port, () => {
    console.log("El servidor está corriendo en el puerto " + port);
});