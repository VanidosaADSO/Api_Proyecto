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
            html: `<div>

            <style>
              @media screen and (max-width: 1024px) {
                .container-main {
                  width: 96% !important;
                }
              }
        
              @media screen and (max-width: 600px) {
                .logo {
                  width: 130px !important;
                }
        
                .title-name {
                  font-size: 18px !important;
                }
        
                h3 {
                  font-size: 17px !important;
                }
        
                h4 {
                  font-size: 15px !important;
                }
        
                .text,
                li {
                  font-size: 14px !important;
                }
        
                .reset-button {
                  padding: 9px 15px !important;
                  font-size: 14px !important;
                }
        
                .text-vanidosa {
                  font-size: 12px !important;
                }
              }
            </style>
        
            <div class="container-main" style="
              font-family: Arial, Helvetica, sans-serif;
              width: 50%;
              margin: auto;
              padding: 20px 0; 
              background-color: #273746; 
              border-radius: 10px
            ">
        
              <div style="
                flex-direction: column;
                display: flex; 
                align-items: center;
                width: 90%; 
                margin: 0 auto;
              ">
        
                <div style="display: flex; justify-content: center; margin: 20px 0;">
                  <img class="logo" src="cid:logo@unique_cid" alt="Logo Vanidosa SPA" style="width: 140px; color: #ffffff;">
                </div>
        
                <h2 Class="title-name" style="text-align: center; font-size: 22px; color: #ffffff;">Hola, ${Correo}</h2>
        
                <p class="text" style=" text-align: center; font-size: 16px; color: #ffffff;">
                  Haz clic en el siguiente enlace para restablecer tu contraseña:
                </p>
        
                <div style="margin: 0px 0px 16px 0px; display: flex;">
        
                  <a class="reset-button" id="resetLink" href="${resetLink}" style="
                  padding: 10px 15px; 
                  text-align: center;
                  font-size: 16px; 
                  color: #ffffff; 
                  background-color: #007bff; 
                  text-decoration: none;">
                    Restablecer contraseña
                  </a>
        
                </div>
        
                <p class="text" style="text-align: center; font-size: 16px; color: #ffffff;">
                  Si no estás tratando de recuperar tus credenciales de inicio de sesión en Vanidosa SPA,
                  por favor, ignora este correo electrónico. Es posible que otro usuario
                  haya introducido su información de inicio de sesión de manera incorrecta.
                </p>
        
                <div style="margin-top: 1em;">
                  <p class="text-vanidosa" style="text-align: center; font-size: 13px; color: #ffffff;">
                    Saludos, Vanidosa SPA<br>
                    Calle 101 # 18 - 80, Barrio Varenillo, Turbo Antioquia<br>
                    +573136871870
                  </p>
                </div>
        
              </div>
        
            </div>
        
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
