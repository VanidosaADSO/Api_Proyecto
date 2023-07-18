const rols = require ("../models/rol")

const getRol = async (req, res) => {
    const rol = await rols.find()

    res.json({
        rol
    })
}

const postrol = async (req, res) => {

    const { Nombre, Permisos, Estado } = req.body

    const rol1 = new rols({ Nombre, Permisos,  Estado })
    await rol1.save()

    res.json({
        rol1
    })

}

const putrol = async (req, res) => {

    const { _id, Nombre, Estado } = req.body

    const rol1 = await rols.findByIdAndUpdate({ _id: _id }, { Nombre: Nombre,  Estado: Estado })

    res.json({
        rol1
    })
}

const patchrol = async (req, res) => {
    const { _id, Estado } = req.body
    const rol1 = await rols.findOneAndUpdate({ _id: _id }, { Estado: Estado })
    res.json({
        rol1
    })
}

const deleterol = async (req, res) => {
    const { _id } = req.query

    const rol1 = await rols.findOneAndDelete({ _id: _id })

    res.json({
        rol1
    }) 
}

module.exports = {
    getRol,
    postrol,
    putrol,
    patchrol,
    deleterol
}