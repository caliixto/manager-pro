
const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            family: 4,
        });
        
        console.log("Conectado a la base de datos: ManagerPro");
        
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido establecer la coneccion a la bbdd");
    }
}

module.exports = connection;
