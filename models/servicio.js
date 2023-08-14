const { Schema, model } = require('mongoose')

const ServicioSchema = Schema({
    Nombre: {
        type: String
        // required: [true, 'El nombre es un campo obligatorio']
    },
    Tiempo: {
        type: Number
        // required: [true, 'El tiempo es un campo obligatorio']
    },
    Precio: {
        type: Number
        // required: [true, 'El precio es un campo obligatorio']
    },
    Descripcion: {
        type: String
        // required: [true, 'La descripcion es un campo obligatorio']
    },
    Imagen:{
        type:String
        // required: [true, 'La imagen es un campo obligatorio']
    },
    Estado: {
        type: Boolean,
        default: true
    }
})

module.exports = model('Servicio', ServicioSchema)