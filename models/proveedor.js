const {Schema, model} = require('mongoose')

//Definir la estructura de la colección 
const ProveedorSchema = Schema({
    Nombre: {
        type: String,
          required:[true, 'El nombre es un campo obligatorio']
    },
    Apellido: {
        type: String,
        required:[true, 'El apellido es un campo obligatorio']
    },
    Correo: {
        type: String,
        required:[true, 'El correo es un campo obligatorio'],
        unique:true
    },    
    Ciudad: {
        type: String,
        required:[true, 'El correo es un campo obligatorio']
    },
    Direccion: {
        type: String,
        required:[true, 'La direccion es un campo obligatorio'],

    },
    Telefono: {
        type: Number,
        required:[true, 'El telefono es un campo obligatorio']
    },
    Nit: {
        type: Number,
        required:[true, 'El nit es un campo obligatorio'],
        unique:true
    },
    Estado: {
        type: Boolean,
        default:true
    }
})

module.exports = model('Proveedor', ProveedorSchema)