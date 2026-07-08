const mongoose = require("mongoose");

const connection = async()=>{
    try {

        await mongoose.connect("mongodb+srv://calixto2jcc_db_user:qwlWmMV9uoUoGE7P@cluster0.r5xjf1z.mongodb.net/ManagerPro");

        console.log("Conectado a la base de datos: ManagerPro");
        
    } catch (error) {
        console.log(error);

        throw new Error("No se ha podido establecer la coneccion a la bbdd")
    }
}

module.exports= connection;