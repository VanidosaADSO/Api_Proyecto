const compras = require('../models/compra')
const insumos = require('../models/insumo')

const getcompras = async (req, res) => {
    const compra = await compras.find()

    res.json({
        compra
    })
}

const postcompras = async (req, res) => {
    const { N_factura, M_pago, Fecha, Proveedor, Productos, Total_factura, Estado } = req.body;

    const compra1 = new compras({ N_factura, M_pago, Fecha, Proveedor, Productos, Total_factura, Estado });
    await compra1.save();

    for (const producto of Productos) {
        const { Nombre, Cantidad } = producto;
        const insumo = await insumos.findOne({ Nombre });

        if (insumo) {
            insumo.Cantidad += Cantidad;
            await insumo.save();
        }
    }

    res.json({
        compra1
    });
};

const putcompras = async (req, res) => {
    const { _id, N_factura, M_pago, Fecha, Proveedor, Productos, Estado } = req.body;

    if (Productos && Array.isArray(Productos)) {

        const compra = await compras.findOne({ _id: _id });

        if (!compra) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }

        let updatedTotal = compra.Total_factura;

        const updatedProductos = compra.Productos.map(existingProducto => {
            const productoData = Productos.find(p => p._id && p._id.toString() === existingProducto._id.toString());
            if (productoData) {
                if (productoData.eliminar) {
                    // Producto marcado para eliminación, resta su contribución al total
                    updatedTotal -= existingProducto.Cantidad * existingProducto.Precio;
                    return null; // Marcar para eliminación
                }
                const updatedProducto = { ...existingProducto.toObject(), ...productoData };
                const cambioEnTotal = (updatedProducto.Cantidad * updatedProducto.Precio) - (existingProducto.Cantidad * existingProducto.Precio);
                updatedTotal += cambioEnTotal;
                return updatedProducto;
            }
            return existingProducto;
        }).filter(producto => producto !== null); // Filtrar productos marcados para eliminación

        // Agregar nuevos productos en el array de Productos
        const nuevosProductos = Productos.filter(p => !p._id);
        nuevosProductos.forEach(nuevoProducto => {
            updatedProductos.push(nuevoProducto);
            updatedTotal += nuevoProducto.Cantidad * nuevoProducto.Precio;
        });

        // Realiza la actualización en la base de datos
        const updatedCompra = await compras.findByIdAndUpdate(
            { _id: _id },
            { N_factura, M_pago, Fecha, Proveedor, Productos: updatedProductos, Total_factura: updatedTotal, Estado },
            { new: true }
        );

        res.json({
            compra: updatedCompra,
        });
    } else {
        res.status(400).json({ error: 'La propiedad Productos debe ser un array' });
    }
};


const patchcompra = async (req, res) => {
    const { _id, Estado } = req.body
    const compra1 = await compras.findOneAndUpdate({ _id: _id }, { Estado: Estado })
    res.json({
        compra1
    })
}


const deletecompras = async (req, res) => {
    const { _id } = req.query

    const compras1 = await compras.findOneAndDelete({ _id: _id })

    res.json({
        compras1
    })
}


module.exports = {
    getcompras,
    postcompras,
    putcompras,
    patchcompra,
    deletecompras
}