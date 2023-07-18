const Proveedor = require('../models/proveedor')

const getProveedor = async (req, res) => {
    const proveedor = await Proveedor.find()

    res.json({
        proveedor
    })
}

const postProveedor = async (req, res) => {
    //Desestructuración de parámetros 
    const { Nombre, Apellido, Correo, Ciudad, Direccion, Telefono, Nit, Estado } = req.body
    //Crear el objeto 
    const proveedor1 = new Proveedor({ Nombre, Apellido, Correo, Ciudad, Direccion, Telefono, Nit, Estado  })
    await proveedor1.save()//Guardar en MongoDB

    res.json({
        proveedor1
    })

}

const putProveedores = async (req, res) => {
    const {_id, Nombre, Apellido, Correo, Ciudad, Direccion, Telefono, Nit, Estado } = req.body

    const proveedor1 = await Proveedor.findOneAndUpdate({_id:_id }, {
        Nombre: Nombre,
        Apellido: Apellido,
        Correo: Correo,
        Ciudad:Ciudad,
        Direccion: Direccion,
        Telefono: Telefono,
        Nit: Nit,
        Estado:Estado
    })

    res.json({
        proveedor1
    })
}
const patchProveedor = async (req, res) => {
    const { _id, Estado } = req.body
    const proveedor1 = await Proveedor.findOneAndUpdate({ _id:_id }, { Estado:Estado })
    res.json({
        proveedor1
    })
}

const deleteProveedor = async (req, res) => {
    const { _id } = req.query

    const proveedor1 = await Proveedor.findOneAndDelete({ _id:_id })

    res.json({
        proveedor1
    })
}

module.exports = {
    getProveedor,
    postProveedor,
    putProveedores,
    patchProveedor,
    deleteProveedor

}