const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { solicitarResetPassword, confirmarResetPassword } = require("../utils/passwordReset");


const registrarUsers = async(req, res)=>{

    try{
        const {nombrecompleto,email,password} = req.body;

        const params = req.body;
        console.log("Datos recibidos en el controlador:", params);

        if (!params.password) {
            return res.status(400).send({ status: "error", message: "La contraseña es obligatoria" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(params.password, salt);


        const user = new Users({
            nombrecompleto,
            email,
            password:passwordHash
        });

        await user.save();
        await generarEquipoInicial(user._id);

        return res.status(201).send({
            status:"success",
            message:"Usuario registrado correctamente"
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
                status:"error",
                message:"error registrar el usuario"
        });
    }

}

const loginUsers = async (req,res) =>{
    try{
        const {nombrecompleto,email, password} = req.body;

        const emailEncontrado = await Users.findOne({email:email});

        if (!emailEncontrado) {
            return res.status(400).json({ status: "error", message: "email no registrado" });
        }

        const passwordCorrecta = await bcrypt.compare(password, emailEncontrado.password);

        const token = jwt.sign(
            { id: emailEncontrado._id, email: emailEncontrado.email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        if (!passwordCorrecta) {
            return res.status(401).json({ status: "error", mensaje: "Contraseña incorrecta" });
        }
        return res.json({ status: "success", mensaje: "¡Bienvenido,!"+ nombrecompleto, token, user: { name: emailEncontrado.nombrecompleto, role: "coach" }  });

    }catch(error){
        console.log(error);
        return res.status(500).send({
            status:"error",
            message:"error en el servidor"
        });
    }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await solicitarResetPassword(Users,email);
    return res.json({ status: "success", mensaje: "Si el correo existe, recibirás un enlace de recuperación." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};


module.exports={
    registrarUsers,
    loginUsers,
    forgotPassword
};