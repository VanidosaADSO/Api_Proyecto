const { Schema, model } = require('mongoose')

const ProductoSchema = Schema({
    Nombre: {
        type: String,
        required: [true, 'El producto es un campo obligatorio'],
    },
    Cantidad: {
        type: Number,
        required: [true, 'La cantidad es un campo obligatorio']
    },
    Precio: {
        type: Number,
        required: [true, 'El precio es un campo obligatorio']
    },

})

const CompraSchema = Schema({

    
    N_factura: {
        type: Number,
        required: [true, 'El numero de factura es un campo obligatorio'],
        unique:true
    },
    Productos:{
        type:[ProductoSchema],
        required: [true, 'Es necesario agregar un producto'],

    },
    M_pago: {
        type: String,
        required: [true, 'El medio de pago es un campo obligatorio'],
        enum: ['Efectivo', 'Transferencia']
    },
    Fecha: {
        type: String,
        required: [true, 'La fecha es un campo obligatorio']
    },
    Proveedor: {
        type: String,
        required: [true, 'El proveedor es un campo obligatorio']
    },
    Total_factura: {
        type: Number,
        required: [true, 'El total de la factura es un campo obligatorio']
    },
    Estado: {
        type: Boolean,
        default:true
    }
})

module.exports = model('Compras', CompraSchema)