const servicios = require('../models/servicio')
const getservicio = async (req, res) => {
    const servicio = await servicios.find()

    res.json({
        servicio
    })
}
const postservicio = async (req, res) => {

    const { Nombre, Tiempo, Precio, Descripcion, Imagen, Estado } = req.body;

    // Convertir la imagen base64 en Buffer
    const imageData = Buffer.from(Imagen.split(',')[1], 'base64');

    // Crear un documento en MongoDB para almacenar la imagen
    const newImage = new ImageModel({
        data: imageData,
        contentType: 'image/png', // Asegúrate de ajustar el tipo de contenido según el formato de imagen que estés enviando
    });

    // Guardar la imagen en la base de datos
    const savedImage = await newImage.save();
    const servicio1 = new servicios({ Nombre, Tiempo, Precio, Descripcion, Imagen: savedImage._id, Estado });
    await servicio1.save();
    res.json({ servicio1 });
};

const putservicio = async (req, res) => {
    const { _id, Nombre, Tiempo, Precio, Descripcion, Imagen, Estado } = req.body
    const servicio1 = await servicios.findByIdAndUpdate({ _id: _id }, { Nombre: Nombre, Tiempo: Tiempo, Precio: Precio, Descripcion: Descripcion, Imagen: Imagen, Estado: Estado })
    res.json({
        servicio1
    })
}
const patchservicio = async (req, res) => {
    const { _id, Estado } = req.body
    const servicio1 = await servicios.findOneAndUpdate({ _id: _id }, { Estado: Estado })
    res.json({
        servicio1
    })
}


const deleteservicio = async (req, res) => {
    const { _id } = req.query

    const servicio1 = await servicios.findOneAndDelete({ _id: _id })

    res.json({
        servicio1
    })
}

module.exports = {
    getservicio,
    postservicio,
    putservicio,
    patchservicio,
    deleteservicio,
}