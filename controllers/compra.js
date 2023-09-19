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
        }else{
            console.log('Producto no encontrado')
        }
    }

    res.json({
        compra1
    });
};

const putcompras = async (req, res) => {
    const { _id, N_factura, M_pago, Fecha, Proveedor, Productos, Estado } = req.body;

    if (Productos && Array.isArray(Productos)) {
        try {
            const compra = await compras.findOne({ _id: _id });

            if (!compra) {
                return res.status(404).json({ error: 'Compra no encontrada' });
            }

            let updatedTotal = compra.Total_factura;

            const insumosUpdates = []; // Almacenará las actualizaciones de insumos

            const updatedProductos = compra.Productos.map(existingProducto => {
                const productoData = Productos.find(p => p._id && p._id.toString() === existingProducto._id.toString());
                if (productoData) {
                    if (productoData.eliminar) {
                        // Producto marcado para eliminación, resta su contribución al total
                        updatedTotal -= existingProducto.Cantidad * existingProducto.Precio;
                        insumosUpdates.push({ nombre: existingProducto.Nombre, cantidad: -existingProducto.Cantidad });
                        return null; // Marcar para eliminación
                    }
                    const updatedProducto = { ...existingProducto.toObject(), ...productoData };
                    const cambioEnTotal = (updatedProducto.Cantidad * updatedProducto.Precio) - (existingProducto.Cantidad * existingProducto.Precio);
                    updatedTotal += cambioEnTotal;
                    const cantidadDiferencia = updatedProducto.Cantidad - existingProducto.Cantidad;
                    insumosUpdates.push({ nombre: existingProducto.Nombre, cantidad: cantidadDiferencia });
                    return updatedProducto;
                }
                return existingProducto;
            }).filter(producto => producto !== null); // Filtrar productos marcados para eliminación

            // Agregar nuevos productos en el array de Productos
            const nuevosProductos = Productos.filter(p => !p._id);
            nuevosProductos.forEach(nuevoProducto => {
                updatedProductos.push(nuevoProducto);
                updatedTotal += nuevoProducto.Cantidad * nuevoProducto.Precio;
                insumosUpdates.push({ nombre: nuevoProducto.Nombre, cantidad: nuevoProducto.Cantidad });
            });

            // Realiza las actualizaciones de cantidad en la colección "insumos"
            for (const insumoUpdate of insumosUpdates) {
                await insumos.updateOne(
                    { Nombre: insumoUpdate.nombre },
                    { $inc: { Cantidad: insumoUpdate.cantidad } }
                );
            }

            // Realiza la actualización en la base de datos de compras
            const updatedCompra = await compras.findByIdAndUpdate(
                { _id: _id },
                { N_factura, M_pago, Fecha, Proveedor, Productos: updatedProductos, Total_factura: updatedTotal, Estado },
                { new: true }
            );

            res.json({
                compra: updatedCompra,
            });
        } catch (error) {
            res.status(500).json({ error: 'Error en el servidor' });
        }
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