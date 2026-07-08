const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");


const registrarAdmin = async(req, res)=>{

    try{
        const {usuario, password} = req.body;

        const params = req.body;
        console.log("Datos recibidos en el controlador:", params);

        if (!params.password) {
            return res.status(400).send({ status: "error", message: "La contraseña es obligatoria" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(params.password, salt);


        const admin = new Admin({
            usuario,
            password:passwordHash
        });

        await admin.save();

        return res.status(201).send({
            status:"success",
            message:"todo correcto"
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
                status:"error",
                message:"error al guardar usuario"
        });
    }

}

const loginAdmin = async (req,res) =>{
    try{
        const {usuario, password} = req.body;
        console.log("LOGIN INTENTADO - Usuario:", usuario, "Password:", password);

        const usuarioEncontrado = await Usuario.findOne({usuario:usuario});
        console.log("¿Usuario encontrado en BD?:", usuarioEncontrado ? "Sí" : "No");

        if (!usuarioEncontrado) {
            return res.status(400).json({ status: "error", message: "Usuario no registrado" });
        }
        console.log("Password guardada en BD:", usuarioEncontrado.password);

        const passwordCorrecta = await bcrypt.compare(password, usuarioEncontrado.password);
        console.log("¿Contraseña correcta?:", passwordCorrecta);
        console.log("Contraseña recibida del form:", req.body.password);
        console.log("Hash en la base de datos:", usuarioEncontrado.password);

        if (!passwordCorrecta) {
            return res.status(401).json({ status: "error", mensaje: "Contraseña incorrecta" });
        }
        return res.json({ status: "success", mensaje: "¡Bienvenido, admin!" });

    }catch(error){
        console.log(error);
        return res.status(500).send({
                status:"error",
                message:"error en el servidor"
        });
    }
}

module.exports={
    registrarAdmin,
    loginAdmin
};