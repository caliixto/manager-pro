const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { solicitarResetPassword, confirmarResetPassword } = require("../utils/passwordReset");


const registrarAdmin = async(req, res)=>{

    try{
        const {nombrecompleto,email, password} = req.body;

        const params = req.body;
        console.log("Datos recibidos en el controlador:", params);

        if (!params.password) {
            return res.status(400).send({ status: "error", message: "La contraseña es obligatoria" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(params.password, salt);


        const admin = new Admin({
            nombrecompleto,
            email,
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
                message:"error"
        });
    }

}

const loginAdmin = async (req,res) =>{
    try{
        const {nombrecompleto,email, password} = req.body;

        const emailEncontrado = await Admin.findOne({email:email});

        if (!emailEncontrado) {
            return res.status(400).json({ status: "error", message: "email no registrado" });
        }
        console.log("Password guardada en BD:", emailEncontrado.password);

        const passwordCorrecta = await bcrypt.compare(password, emailEncontrado.password);

        const token = jwt.sign(
            { id: emailEncontrado._id, email: emailEncontrado.email },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        if (!passwordCorrecta) {
            return res.status(401).json({ status: "error", mensaje: "Contraseña incorrecta" });
        }
        return res.json({ status: "success", mensaje: "¡Bienvenido, admin!", token,  user: { name: emailEncontrado.nombrecompleto, role: "admin" }  });

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

    const adminEncontrado = await Admin.findOne({ email });

    if (!adminEncontrado) {
      // Por seguridad, no revelamos si el email existe o no
      return res.json({ 
        status: "success", 
        mensaje: "Si el correo existe, recibirás un enlace de recuperación." 
      });
    }

    // Genera un token aleatorio y seguro
    const token = crypto.randomBytes(32).toString("hex");

    // Guarda el token y su caducidad (1 hora desde ahora)
    adminEncontrado.resetPasswordToken = token;
    adminEncontrado.resetPasswordExpires = Date.now() + 3600000; // 1 hora en milisegundos
    await adminEncontrado.save();

    // Construye el enlace que irá en el correo
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await enviarEmailRecuperacion(adminEncontrado.email, resetLink);

    return res.json({ 
      status: "success", 
      mensaje: "Si el correo existe, recibirás un enlace de recuperación." 
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      status: "error", 
      message: "Error en el servidor" 
    });
  }
};


module.exports={
    registrarAdmin,
    loginAdmin,
    forgotPassword,
};