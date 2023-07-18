const {Schema, model} = require('mongoose')

const PermisosSchema = Schema({
    Nombre:{
        type:String,
        required: [true, 'El nombre del permiso es un campo obligatorio'],
    }
})

const rolSchema = Schema({
    Nombre:{
        type:String,
        required: [true, 'El nombre es un campo obligatorio'],
    },
    Estado: {
        type: Boolean,
        default:true
    },
    Permisos:{
        type:[PermisosSchema]
        // required: [true, 'Se tiene que agregar al menos un permiso'],
    }
})
module.exports = model('Rol', rolSchema)