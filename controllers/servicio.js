const servicios = require('../models/servicio');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');


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

const obtenerImagen = (req, res) => {
    const id = req.params.id;

    Producto.findById(id)
        .then((result) => {

            if (result.imagen) {

                const pathImagen = path.join(__dirname, '../uploads', result.imagen)

                if (fs.existsSync(pathImagen)) {
                    return res.sendFile(pathImagen)
                }
            }

            const pathImagen = path.join(__dirname, '../uploadsno_image_available.png')
            res.sendFile(pathImagen)
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los datos del producto' });
        });
};

const postservicio = async (req, res) => {
    try {
        if (!req.files || !req.files.imagen) {
            return res.status(400).json({ msg: 'No se proporcionó una imagen válida.' });
        }

        const { imagen } = req.files;
        const nombreCortado = imagen.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        const extensionesValidas = ['png', 'jpg', 'jpeg'];
        if (!extensionesValidas.includes(extension)) {
            return res.status(400).json({ msg: `La extensión ${extension} no es permitida, extensiones válidas ${extensionesValidas}` });
        }

        const nombreFinal = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads', nombreFinal);

        // Utiliza promisify para convertir imagen.mv en una función basada en promesas
        const mvPromise = util.promisify(imagen.mv);

        await mvPromise(uploadPath); // Espera a que se complete la operación de mover la imagen

        // Ahora puedes guardar la información del producto en la base de datos
        const { Nombre, Tiempo, Productos, Precio, Descripcion, Estado } = req.body;
        const servicio1 = new servicios({
            Nombre,
            Tiempo,
            Productos,
            Precio,
            Descripcion,
            Estado,
            imagen: nombreFinal, // Guarda el nombre del archivo en la base de datos
        });
        await servicio1.save()

        res.status(201).json({ servicio1: servicio1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inesperado.' });
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
    obtenerImagen,
    postservicio,
    putservicio,
    patchservicio,
    deleteservicio,
    fileUpload
}