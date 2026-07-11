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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 4. Cargar rutas
const Usersrouter = require("./routers/users");
const Adminrouter = require("./routers/admin");
const authRouter = require("./routers/auth");
const playersRouter = require("./routers/player");

app.use("/api/admin", Adminrouter);
app.use('/api/users', Usersrouter);
app.use("/api/auth", authRouter);
app.use("/api/players",playersRouter)

// 5. Ruta base
app.get('/', (req, res) => {
    res.send('¡API del ManagerPro funcionando!');
});

app.listen(port, () => {
    console.log("El servidor está corriendo en el puerto " + port);
});