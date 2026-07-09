const nodemailer = require("nodemailer");

// Configuración del transporte usando Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envía el correo de recuperación de contraseña
 * @param {string} to - Email del destinatario
 * @param {string} resetLink - Enlace completo con el token para resetear la contraseña
 */
const enviarEmailRecuperacion = async (to, resetLink) => {
  const mailOptions = {
    from: `"Manager Pro" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recupera tu contraseña - Manager Pro",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #202227; padding: 30px; color: #ffffff;">
        <div style="max-width: 480px; margin: 0 auto; background-color: #272C30; border-radius: 16px; padding: 32px; border: 1px solid #3a3f45;">
          
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
            <div style="width: 32px; height: 32px; background-color: #22c55e; border-radius: 8px; display: inline-block;"></div>
            <span style="font-size: 18px; font-weight: bold; color: #ffffff;">Manager Pro</span>
          </div>

          <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 12px;">Recupera tu contraseña</h2>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
            Hemos recibido una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo con total seguridad.
          </p>

          <a href="${resetLink}" 
             style="display: inline-block; background-color: #22c55e; color: #0e0e0e; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 8px; font-size: 15px;">
            Restablecer contraseña
          </a>

          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            Este enlace caducará en 1 hora por motivos de seguridad.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { enviarEmailRecuperacion };