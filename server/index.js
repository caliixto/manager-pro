const connection = require("./database/connection.js");
const express = require("express");
const cors = require("cors");

// 1. Conexión a BD
connection();

// 2. Crear el servidor
const app = express();
const port = process.env.PORT || 5000;


//Cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 4. Cargar rutas
const Usersrouter = require("./routers/users");
const Adminrouter = require("./routers/admin");

app.use("/api/admin", Adminrouter);
app.use('/api/users', Usersrouter);

// 5. Ruta base
app.get('/', (req, res) => {
    res.send('¡API del ManagerPro funcionando!');
});

app.listen(port, () => {
    console.log("El servidor está corriendo en el puerto " + port);
});