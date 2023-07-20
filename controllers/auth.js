const { response, request } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const { Correo, Contrasena } = req.body;

    try {
        // Si el correo existe en la base de datos
        // Buscar si el usuario existe en la colección
        const usuario = await Usuario.findOne({ Correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / correo no encontrado'
            });
        }

        const contrasenaCorrecta = await bcrypt.compare(Contrasena, usuario.Contrasena);
        if (!contrasenaCorrecta) {
            return res.status(400).json({
                msg: 'Usuario / contraseña incorrecta'
            });
        }

        const token = await generarJWT(usuario._id);
        res.json({
            token
        });
        console.log('SESION INICIADA');
    } catch (error) {
        console.log(error);
    }

    // Si el password existe en la base de datos

};

module.exports = {
    login
};
