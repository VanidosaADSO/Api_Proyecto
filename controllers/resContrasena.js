const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt');
const nodemailer = require('nodemailer');
// const fs = require('fs');


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
        
        // Ejemplo de cómo buscar el usuario por correo electrónico
        const usuario = await Usuario.findOne({ Correo: Correo });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const token = await generarJWT(usuario._id);
        
        usuario.token = token;
        await usuario.save();
        
        // const imagen = fs.createReadStream('./logo-full.png');
        const mailOptions = {

            from: 'AutenticacionVanidosa@gmail.com',
            to: Correo,
            subject: 'Recuperar contraseña',
            html: `
                <div style="background-color: #273746; padding: 20px; text-align: center; color: #ffffff; margin-left: 200px; margin-right: 200px; border-radius: 10px ">
                    <img src="cid:logo@unique_cid" alt="Logo Vanidosa SPA" style="display: block; width: 200px; margin: 0 auto;">
                    <h1>Hola, ${Correo}:</h1>
                    <p style="font-size: 16px; color: #ffffff;">Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="https://vanidosa-spa.onrender.com/Reestablecer/${token}" style="display: block; width: 200px; background-color: #007bff; color: #fff; text-align: center; padding: 10px; text-decoration: none; margin: 10px auto;">Restablecer Contraseña</a>
        
                    <p style="color: #ffffff;" >Si no estás tratando de recuperar tus credenciales de inicio de sesión en Vanidosa Spa, 
                    por favor, ignora este correo electrónico. Es posible que otro usuario 
                    haya introducido su información de inicio de sesión de manera incorrecta.</p>
        
                    <p style="font-size: 14px; color: #ffffff;">Saludos, Vanidosa Spa <br>
                    Calle101 #18-80 Barrio Varenillo Turbo Antioquia <br>
                    +573136871870
                    </p>
                </div>
            `,
            // attachments: [
            //     {
            //       filename: 'logo-full.png',
            //       content: imagen,
            //       cid: 'logo@unique_cid', // Referencia única para usar en la etiqueta de imagen en el HTML del correo electrónico
            //     },
            //   ],
        };
        

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
}

const patchContrasena = async (req, res) => {
    const { Correo, Contrasena } = req.body
    const Usuario1 = await Usuario.findOneAndUpdate({ Correo: Correo }, { Contrasena: Contrasena })
    res.json({
        Usuario1
    })
}


module.exports = {
    postOlvidocontrasena,
    patchContrasena
}