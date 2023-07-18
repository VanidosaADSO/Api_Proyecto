const {Schema, model}=require('mongoose')

const insumosSchema=Schema({

    Nombre:{
        type:  String,
        required:[true, 'El nombre es un campo obligatorio'],
        unique:true
    },
    Cantidad:{
        type: Number,
        required:[true, 'La cantidad es un campo obligatorio']
    },
    Unidad_Medida:{
        type:  String,
        required:[true, 'La unidad de medida es un campo obligatorio']
    },
    Estado:{
        type:Boolean,
        default:true
    }
})


module.exports = model('insumos',insumosSchema)
