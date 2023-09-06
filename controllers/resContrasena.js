const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'AutenticacionVanidosa@gmail.com',
        pass: 'njxbkzuvwqtbbuca'
    }
});

const postOlvidocontrasena = async (req, res) => {
    const { Correo } = req.body;

    try {
        const usuario = await Usuario.findOne({ Correo: Correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const token = await generarJWT(usuario._id);

        usuario.token = token;
        await usuario.save();

        const resetLink = `https://rescontrasena.onrender.com?token=${token}`;

        const mailOptions = {
            from: 'AutenticacionVanidosa@gmail.com',
            to: Correo,
            subject: 'Recuperar contraseña',
            attachments: [
                {
                    filename: 'logo.png',
                    path: __dirname + '/logo.png',
                    cid: 'logo@unique_cid'
                }
            ],
            html: `
            <div style="
            background-color: #273746; 
            width: 86%;
            margin: auto;
            padding: 20px; 
            text-align: center; 
            color: #ffffff;  
            border-radius: 10px ">
        
            <img src="cid:logo@unique_cid" alt="Logo Vanidosa SPA" style="
              display: block; 
              width: 150px; 
              margin: 0 auto;">
        
            <h2>Hola, ${Correo}:</h2>
        
            <p style="
              font-size: 16px; 
              color: #ffffff;">
              Haz clic en el siguiente enlace para restablecer tu contraseña:
            </p>
        
            <a id="resetLink" href="${resetLink}" style="
                background-color: #007bff; 
                color: #ffffff; 
                text-align: center; 
                padding: 10px 15px; 
                text-decoration: none; 
                margin: 10px auto;">
                Restablecer Contraseña
            </a>
        
            <p style="
              color: #ffffff;">
              Si no estás tratando de recuperar tus credenciales de inicio de sesión en Vanidosa Spa,
              por favor, ignora este correo electrónico. Es posible que otro usuario
              haya introducido su información de inicio de sesión de manera incorrecta.
            </p>
        
            <p style="
              font-size: 14px; 
              color: #ffffff;">
              Saludos, Vanidosa Spa<br>
              Calle101 #18-80 Barrio Varenillo Turbo Antioquia<br>
              +573136871870
            </p>
        
          </div>
            `,
        };

        const script = `
            <script>
                document.getElementById("resetLink").addEventListener("click", function(event) {
                    event.preventDefault();
                    const token = "${token}";
                    const baseUrl = "https://rescontrasena.onrender.com?token=";
                    window.location.href = baseUrl + token;
                });
            </script>
        `;

        // Agrega el script JavaScript al final del HTML del correo
        mailOptions.html += script;

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Ocurrió un error al enviar el correo electrónico' });
            } else {
                console.log('Correo enviado: ' + info.response);
                res.json({ message: 'Correo enviado con éxito' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
};

const patchContrasena = async (req, res) => {
    const { Contrasena, token } = req.body;

    try {
        // Verificar si el token es válido y encontrar al usuario correspondiente
        const usuario = await Usuario.findOne({ token: token });
        if (!usuario) {
            return res.status(401).json({ error: 'Token inválido o usuario no encontrado' });
        }

        // Generar un nuevo hash para la contraseña
        const hashedContrasena = await bcrypt.hash(Contrasena, saltRounds);

        // Actualizar la contraseña y eliminar el token una vez que se haya usado
        usuario.Contrasena = hashedContrasena;
        usuario.token = null;
        await usuario.save();

        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
};

module.exports = {
    postOlvidocontrasena,
    patchContrasena
};
