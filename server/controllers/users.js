const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { solicitarResetPassword, confirmarResetPassword } = require("../utils/passwordReset");
const {generarEquipoInicial} = require ("../utils/generarEquipoInicial");


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
        const {nombrecompleto,email, password, nombreEquipo, escudo, monedas} = req.body;

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
        return res.json({ status: "success", mensaje: "¡Bienvenido,!"+ nombrecompleto, token, user: { name: emailEncontrado.nombrecompleto,nombreEquipo: emailEncontrado.nombreEquipo, 
                escudo: emailEncontrado.escudo,monedas:emailEncontrado.monedas, role: "coach" }  });

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

const obtenerAlineacion = async (req, res) => {
  try {
    const equipoId = req.user.id;

    const user = await Users.findById(equipoId).populate('alineacion');

    if (!user) {
      return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    }

    return res.json({ status: "success", alineacion: user.alineacion });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const guardarAlineacion = async (req, res) => {
  try {
    const equipoId = req.user.id;
    const { alineacion } = req.body; // array de 11 IDs de jugadores

    if (!Array.isArray(alineacion) || alineacion.length !== 11) {
      return res.status(400).json({ status: "error", message: "La alineación debe tener exactamente 11 jugadores" });
    }

    const user = await Users.findByIdAndUpdate(
      equipoId,
      { alineacion },
      { new: true }
    ).populate('alineacion');

    return res.json({ status: "success", mensaje: "Alineación guardada correctamente", alineacion: user.alineacion });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};

const actualizarPerfilEquipo = async (req, res) => {
  try {
    const equipoId = req.user.id;
    const { nombreEquipo } = req.body;

    const camposActualizar = {};

    if (nombreEquipo && nombreEquipo.trim().length > 0) {
      camposActualizar.nombreEquipo = nombreEquipo.trim();
    }

    // Si se subió un archivo, multer-storage-cloudinary ya lo procesó y nos da la URL en req.file.path
    if (req.file) {
      camposActualizar.escudo = req.file.path;
    }

    const user = await Users.findByIdAndUpdate(equipoId, camposActualizar, { new: true });

    return res.json({
      status: 'success',
      mensaje: 'Perfil actualizado correctamente',
      user: {
        nombreEquipo: user.nombreEquipo,
        escudo: user.escudo,
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error', message: 'Error al actualizar el perfil' });
  }
};


module.exports={
    registrarUsers,
    loginUsers,
    forgotPassword,
    obtenerAlineacion,
    guardarAlineacion,
    actualizarPerfilEquipo
};