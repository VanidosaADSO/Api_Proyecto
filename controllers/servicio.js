const servicios = require('../models/servicio');
const multer = require('multer');
const express = require('express');
const app = express();

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
    const { Nombre, Tiempo, Precio, Descripcion, Estado } = req.body;

    try {
        // Maneja la subida de la imagen utilizando el middleware de Multer
        upload.single('Imagen')(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al subir la imagen' });
            }

            // Si la subida de la imagen fue exitosa, obtén la información del archivo
            const imageFilename = req.file ? req.file.filename : null;
            const imageUrl = imageFilename ? `https://api-proyecto-5hms.onrender.com/uploads/${imageFilename}` : null;

            const servicio1 = new servicios({ Nombre, Tiempo, Precio, Descripcion, Imagen: imageUrl, Estado });
            await servicio1.save();

            res.json({ servicio1 });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al guardar el servicio' });
    }
};

const putservicio = async (req, res) => {
    const { _id, Nombre, Tiempo, Precio, Descripcion, Imagen, Estado } = req.body;
    const servicio1 = await servicios.findByIdAndUpdate({ _id: _id }, { Nombre, Tiempo, Precio, Descripcion, Imagen, Estado });
    res.json({ servicio1 });
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