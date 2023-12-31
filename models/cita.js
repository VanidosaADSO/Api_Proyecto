const { Schema, model } = require('mongoose')

const ServicioShema = Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre del servicio es obligatorio']
    }
})

const CitaSchema = Schema({
    Documento: {
        type: Number
    },
    Nombre: {
        type: String,
        required: [true, 'EL nombre es un campo obligatorio']
    },
    Apellidos: {
        type: String,
        required: [true, 'El apellido es un campo obligatorio']
    },
    Servicios: {
        type: [ServicioShema],
        required: [true, 'Se tiene que agregar un servicio como minimo']
    },
    FechaCita: {
        type: Date,
        required: [true, 'La fechaCita es un campo obligatorio']
    },
    HoraCita: {
        type: String,
        required: [true, 'La horaCita es un campo obligatorio']
    },
    Fincita: {
        type: String,
        required: [true, 'La hora fin cita es un campo obligatorio']
    },
    Descripcion: {
        type: String,
        required: [true, 'La descripcion es un campo obligatorio']
    },
    ConfirmarCita: {
        type: Boolean,
        default: false
    },
    Estado: {
        type: Boolean,
        default: true
    }
})

module.exports = model('Citas', CitaSchema)