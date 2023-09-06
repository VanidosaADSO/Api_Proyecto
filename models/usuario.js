const { Schema, model } = require('mongoose')

//Definir la estructura de la colección 
const UsuarioSchema = Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre es un campo obligatorio']
    },
    Apellido: {
        type: String,
        required: [true, 'El apellido es un campo obligatorio']
    },
    Tipo_Documento: {
        type: String,
        required: [true, 'El tipo de documento es un campo obligatorio']
    },
    Documento: {
        type: Number,
        required: [true, 'El documento es un campo obligatorio'],
        unique: true
    },
    Direccion: {
        type: String,
        required: [true, 'La direccion es un campo obligatorio']
    },
    Telefono: {
        type: Number,
        required: [true, 'El telefono es un campo obligatorio']
    },
    Correo: {
        type: String,
        required: [true, 'El correo es un campo obligatorio'],
        unique: true
    },
    Contrasena: {
        type: String,
        required: [true, 'La contraseña es un campo obligatorio']
    },
    // Imagen: {
    //     type: String,
    //     required: [true, 'La imagen es un campo obligatorio']
    // },
    Rol: {
        type: String,
        required: [true, 'El rol es un campo obligatorio'],
        enum: ['Administrador', 'Empleado', 'Cliente']

    },
    Estado: {
        type: Boolean,
        default: true
    },
    dispoEmpleado: {
        type: Boolean
    },
    token: {
        type: String
    }
})

module.exports = model('Usuario', UsuarioSchema)