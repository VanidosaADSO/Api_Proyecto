const { Schema, model } = require('mongoose')

// const ProductoShema = Schema({

//     Nombre: {
//         type: String,
//         required: [true, 'El nombre del producto es obligatorio']
//     },
//     Cantidad: {
//         type: Number,
//         required: [true, 'La cantidad del producto es obligatoria']
//     }
// })

const ServicioSchema = Schema({
    Nombre: {
        type: String,
        required: [true, 'El nombre es un campo obligatorio']
    },
    Tiempo: {
        type: Number,
        required: [true, 'El tiempo es un campo obligatorio']
    },
    // Productos: {
    //     type: [ProductoShema],
    //     required: [true, 'Tiene que haber al menos un producto']
    // },
    Precio: {
        type: Number,
        required: [true, 'El precio es un campo obligatorio']
    },
    Descripcion: {
        type: String,
        required: [true, 'La descripcion es un campo obligatorio']
    },
    imagen: {
        type: String,
        required: [true, 'La imagen es un campo obligatorio']
    },
    Estado: {
        type: Boolean,
        default: true
    }
})

module.exports = model('Servicio', ServicioSchema)