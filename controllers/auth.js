const {response, request} = require ('express')
const { generarJWT } = require('../helpers/generar-jwt')
const Usuario = require ('../models/usuario')
const bcrypt = require ('bcryptjs')

const login = async (req,res) => {
    const {Correo,Contrasena} = req.body

    try {
        // si el correo existe en la bse de datos 
        // Buscar si el usuario existe en la collection
        const usuario = await Usuario.findOne({Correo})

        if (!usuario) {
            return res.estatus(400).json({
                msg:'Usuario / correo no encontrado'
            })
        }

        if(! bcrypt.compare(usuario.Contrasena == Contrasena)){
            return res.status(400).json({
                msg: 'Usuario / contraseña incorrecta'
            })    
        }
        const token = await generarJWT(Usuario._id)
        res.json({
            usuario,
            token
        })
        console.log('SESION INICIADA')
    } catch (error) {
        console.log(error)
    }

    // Si el password existe en la base de datos

}

module.exports = {
   login
}