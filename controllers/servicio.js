const servicios = require('../models/servicio')
const getservicio = async (req, res) => {
    const servicio = await servicios.find()

    res.json({
        servicio
    })
}

const postservicio = async (req, res) => {
    const { Nombre, Tiempo, Precio, Descripcion, Estado } = req.body;
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const ImagenFile = req.files.Imagen;

    const uploadPath = __dirname + '/uploads/' + ImagenFile.name;

    ImagenFile.mv(uploadPath, async function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const servicio1 = new servicios({
            Nombre,
            Tiempo,
            Precio,
            Descripcion,
            Imagen: uploadPath, 
            Estado
        });

        try {
            await servicio1.save();
            res.json({ servicio1 });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
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