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
    const {_id, N_factura, M_pago, Fecha, Proveedor, Producto, Cantidad, Precio, Total_factura, Estado } = req.body

    const compra1 = await compras.findOneAndUpdate({ _id: _id}, { N_factura,M_pago, Fecha, Proveedor, Producto, Cantidad, Precio, Total_factura, Estado })

    res.json({
        compra1
    })
}

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