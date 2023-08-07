const Usuario = require('../models/usuario')
const bcrypt = require ('bcryptjs')

const getUsuario = async (req, res) => {
    const Usuarios = await Usuario.find()

    res.json({
        Usuarios
    })
}

const postUsuario = async (req, res) => {
    const { Nombre, Apellido, Tipo_Documento, Documento, Direccion, Telefono, Correo, Contrasena, Rol, Estado } = req.body

    const Usuario1 = new Usuario({ Nombre, Apellido, Tipo_Documento, Documento, Direccion, Telefono, Correo, Contrasena, Rol, Estado })

    Usuario1.Contrasena = bcrypt.hashSync(Contrasena, 10)
    await Usuario1.save()

    res.json({
        Usuario1
    })
}

const putUsuario = async (req, res) => {
    const {_id, Nombre, Apellido, Tipo_Documento, Documento, Direccion, Telefono, Correo, Contrasena, Rol, Estado } = req.body
    const hashedPassword = await bcrypt.hash(Contrasena, 10);

    const Usuario1 = await Usuario.findOneAndUpdate({_id:_id }, {
        Documento: Documento ,Nombre: Nombre, Apellido: Apellido, Tipo_Documento: Tipo_Documento, Direccion: Direccion,
        Telefono: Telefono, Correo: Correo, Contrasena: hashedPassword, Rol: Rol, Estado: Estado
    })
    res.json({
        Usuario1
    })
}

const patchUsuario = async (req, res) => {
    const { _id, Estado } = req.body
    const Usuario1 = await Usuario.findOneAndUpdate({ _id: _id }, { Estado: Estado })
    res.json({
        Usuario1
    })
}

const deleteUsuario = async (req, res) => {
    const { _id } = req.query

    const Usuario1 = await Usuario.findOneAndDelete({ _id: _id })

    res.json({
        msg: 'Usuario Eliminado',
        Usuario1
    })
}

module.exports = {
    getUsuario,
    postUsuario,
    putUsuario,
    patchUsuario,
    deleteUsuario
}