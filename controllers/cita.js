const citas = require('../models/cita')
const moment = require('moment');


const getcitas = async (req, res) => {
    const cita = await citas.find()
    res.json({
        cita
    })

}


const postcitas = async (req, res) => {
    const { Documento, Nombre, Apellidos, Servicios, FechaCita, HoraCita, Descripcion, Estado } = req.body
    const Cita1 = new citas({ Documento, Nombre, Apellidos, Servicios, FechaCita, HoraCita, Descripcion, Estado })
    await Cita1.save();
    res.json({
        Cita1
    })
};


// Actualizar
const putcitas = async (req, res) => {
    try {
        const { _id, Servicios, FechaCita, HoraCita, Descripcion, Estado } = req.body;

        if (!Array.isArray(Servicios)) {
            return res.status(400).json({ error: 'El campo Servicios debe ser un array' });
        }

        const cita = await citas.findOne({ _id: _id });

        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        const existingServicios = cita.Servicios || [];

        const updatedServicios = existingServicios.map(existingServicio => {
            const updatedServicio = Servicios.find(us => us.Nombre === existingServicio.Nombre);
            if (updatedServicio) {
                return { ...existingServicio.toObject(), ...updatedServicio };
            }
            return existingServicio;
        });

        // Añadir nuevos servicios por Nombre si no existen en la cita actual
        Servicios.forEach(newServicio => {
            if (!existingServicios.some(es => es.Nombre === newServicio.Nombre)) {
                updatedServicios.push({ Nombre: newServicio.Nombre, eliminar: newServicio.eliminar });
            }
        });

        // Filtrar servicios que deben ser eliminados
        const filteredServicios = updatedServicios.filter(servicio => !servicio.eliminar);

        await citas.findByIdAndUpdate(
            { _id: _id },
            { Servicios: filteredServicios, FechaCita, HoraCita, Descripcion, Estado },
            { new: true }
        );

        res.json({
            msg: "Cita actualizada exitosamente"
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};






const patchcitas = async (req, res) => {
    const { _id, Estado } = req.body
    const Cita1 = await citas.findOneAndUpdate({ _id: _id }, { Estado: Estado })
    res.json({
        Cita1
    })
}

// Eliminar
const deletecitas = async (req, res) => {
    const { _id } = req.query
    const Cita1 = await citas.findOneAndDelete({ _id: _id })
    res.json({
        msg: "Cita DELETE ",
        Cita1
    })
}



module.exports = {
    getcitas,
    postcitas,
    putcitas,
    patchcitas,
    deletecitas
}
