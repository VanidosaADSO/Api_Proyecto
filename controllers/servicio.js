const multer = require('multer');
const servicios = require('../models/servicio');
const uploadMulterConfig = require('../utils/multerConfig');
const upload = multer(uploadMulterConfig).array('Imagen', 5);
const { validationResult } = require('express-validator');

const fileUpload = (req, res, next)=>{
    upload(req, res, function(error){
        if(error){
            res.json({
                "error":500
            })
        }
    })
}
const getservicio = async (req, res) => {
    const servicio = await servicios.find();

    res.json({
        servicio
    });
};

const postservicio = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Nombre, Tiempo, Productos, Precio, Descripcion, Estado } = req.body;

    // Asegúrate de que req.files esté disponible si deseas acceder a las imágenes
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron imágenes.' });
    }

    // Procesa las imágenes subidas, genera la URL y guárdala en la base de datos
    const imagenes = req.files.map((file) => {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`; // Genera la URL de la imagen
        return imageUrl;
    });

    const servicio1 = new servicios({
        Nombre,
        Tiempo,
        Productos,
        Precio,
        Descripcion,
        Estado,
        Imagen: imagenes[0], 
    });

    try {
        await servicio1.save();

        res.status(201).json({
            servicio1,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al guardar el servicio.' });
    }
};
const putservicio = async (req, res) => {
    const { _id, Nombre, Tiempo, Productos, Precio, Descripcion, Imagen, Estado } = req.body;

    if (Productos && Array.isArray(Productos)) {

        const servicio = await servicios.findOne({ _id: _id });

        if (!servicio) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        const updatedProductos = servicio.Productos.map(existingProducto => {
            const productoData = Productos.find(p => p._id && p._id.toString() === existingProducto._id.toString());
            if (productoData) {
                if (productoData.eliminar) {
                    return null;
                }
                const updatedProducto = { ...existingProducto.toObject(), ...productoData };
                return updatedProducto;
            }
            return existingProducto;
        }).filter(producto => producto !== null)

        const nuevosProductos = Productos.filter(p => !p._id);
        nuevosProductos.forEach(nuevoProducto => {
            updatedProductos.push(nuevoProducto);
        })

        const updatedProducto = await servicios.findByIdAndUpdate(
            { _id: _id },
            { Nombre, Tiempo, Productos: updatedProductos, Precio, Descripcion, Imagen, Estado },
            { new: true }
        );
        res.json({
            msg: "Servicio actualizado exitosamente",
            cita: updatedProducto
        });

    } else {
        res.status(400).json({ error: 'La propiedad Productos debe ser un array' });
    }
};

const patchservicio = async (req, res) => {
    const { _id, Estado } = req.body;
    const servicio1 = await servicios.findOneAndUpdate({ _id: _id }, { Estado });
    res.json({ servicio1 });
};

const deleteservicio = async (req, res) => {
    const { _id } = req.query;
    const servicio1 = await servicios.findOneAndDelete({ _id: _id });
    res.json({ servicio1 });
};

module.exports = {
    getservicio,
    postservicio,
    putservicio,
    patchservicio,
    deleteservicio,
    fileUpload
}