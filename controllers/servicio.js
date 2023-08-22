const servicios = require('../models/servicio');
const multer = require('multer');
const express = require('express');


// Configura Multer para manejar la subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

const getservicio = async (req, res) => {
    const servicio = await servicios.find();

    res.json({
        servicio
    });
};

const postservicio = async (req, res) => {

    const { Nombre, Tiempo, Productos, Precio, Descripcion, Imagen, Estado } = req.body
    const servicio1 = new servicios({ Nombre, Tiempo, Productos, Precio, Descripcion, Imagen, Estado })
    await servicio1.save()

    res.json({
        servicio1
    })

}


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
}