const insumos = require('../models/insumo')

const getinsumos = async (req,res) => {

    const insumo = await insumos.find()

    res.json({
        insumo
    })
    

}

const postinsumos = async (req, res)=>{
    const {Nombre,Cantidad,Unidad_Medida,Estado}=req.body
    // console.log(req.body)
    const insumo1= new insumos({Nombre,Cantidad,Unidad_Medida,Estado})
    await insumo1.save()

    res.json({
        insumo1
    })

}


const putinsumos = async (req, res) => {
    const {_id, Nombre, Cantidad, Unidad_Medida, Estado } = req.body
    
    const insumo1 = await insumos.findOneAndUpdate({ _id: _id }, {
        Nombre:Nombre, Cantidad: Cantidad,
        Unidad_Medida: Unidad_Medida, Estado: Estado
    })
    console.log(req.body)
    res.json({
        insumo1
    })

}

const patchinsumos = async (req, res) => {
    const { _id, Estado } = req.body
    const insumo1 = await insumos.findOneAndUpdate({ _id: _id }, { Estado: Estado })
    res.json({
        insumo1
    })
}


const deleteinsumos = async ( req,res)=>{
    const {_id}=req.query

    const insumo1 = await insumos.findOneAndDelete({_id:_id})

    res.json({
        msg:'INSUMO DELETE API',
            insumo1
    })
}



module.exports = {
    getinsumos,
    postinsumos,
    putinsumos,
    patchinsumos,
    deleteinsumos
}