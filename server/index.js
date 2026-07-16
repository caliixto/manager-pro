const connection = require("./database/connection.js");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

connection();

const app = express();
const port = process.env.PORT || 5000;

const whitelist = [
  'https://manager-pro-phi.vercel.app',
  'https://manager-50xeljyps-maneger-pro.vercel.app',
  'http://localhost:4200'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','Cache-Control', 'Pragma'],
  credentials: true
}));

// 👇 ESTO ES LO QUE FALTABA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Usersrouter = require("./routers/users");
const Adminrouter = require("./routers/admin");
const authRouter = require("./routers/auth");
const playersRouter = require("./routers/player");
const partidoRouter = require("./routers/partido");

app.use("/api/admin", Adminrouter);
app.use('/api/users', Usersrouter);
app.use("/api/auth", authRouter);
app.use("/api/players", playersRouter);
app.use("/api/partidos", partidoRouter);

app.get('/', (req, res) => {
    res.send('¡API del ManagerPro funcionando!');
});

app.listen(port, () => {
    console.log("El servidor está corriendo en el puerto " + port);
});