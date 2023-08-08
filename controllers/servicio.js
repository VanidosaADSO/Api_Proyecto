const servicios = require('../models/servicio')
const getservicio = async (req, res) => {
    const servicio = await servicios.find()

    res.json({
        servicio
    })
}
const postservicio = async (req, res) => {
    const { Nombre, Tiempo, Precio, Descripcion, Estado } = req.body;

    if (!req.files || !req.files.Imagen) {
        return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen.' });
    }

    const uploadedImage = req.files.Imagen;
    const servicio1 = new servicios({ Nombre, Tiempo, Precio, Descripcion, Estado });

    servicio1.Imagen = uploadedImage.name; 
    try {
        await servicio1.save();

        const uploadPath = __dirname + '/uploads/' + uploadedImage.name;
        uploadedImage.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar la imagen.', error: err.message });
            }

            // Almacenar la URL de la imagen en la base de datos
            servicio1.Imagen = '/uploads/' + uploadedImage.name;
            await servicio1.save();

            res.status(201).json({ message: 'Servicio creado exitosamente.', servicio: servicio1 });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el servicio.', error: error.message });
    }
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