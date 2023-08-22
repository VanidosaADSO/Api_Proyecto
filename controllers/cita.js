const citas = require('../models/cita')
const getcitas = async (req, res) => {
    const cita = await citas.find()
    res.json({
        cita
    })

}


const postcitas = async (req, res) => {
    const { Documento, Nombre, Apellidos, Servicios, FechaCita, HoraCita, horaInicioCitaDB, horaFinCitaDB, Descripcion, ConfirmarCita, Estado } = req.body
    const Cita1 = new citas({ Documento, Nombre, Apellidos, Servicios, FechaCita, HoraCita, horaInicioCitaDB, horaFinCitaDB, Descripcion, ConfirmarCita, Estado })
    await Cita1.save();
    res.json({
        Cita1
    })
};


// Actualizar
const putcitas = async (req, res) => {

    const { _id, Servicios, FechaCita, HoraCita, horaInicioCitaDB, horaFinCitaDB, Descripcion, Estado } = req.body;

    if (Servicios && Array.isArray(Servicios)) {

        const cita = await citas.findOne({ _id: _id });

        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        const updatedServicios = cita.Servicios.map(existingServicio => {
            const servicioData = Servicios.find(p => p._id && p._id.toString() === existingServicio._id.toString());
            if (servicioData) {
                if (servicioData.eliminar) {
                    return null;
                }
                const updatedServicio = { ...existingServicio.toObject(), ...servicioData };
                return updatedServicio;
            }
            return existingServicio;
        }).filter(servicio => servicio !== null)

        //Agregar nuevos servicios 
        const nuevosServicios = Servicios.filter(p => !p._id);
        nuevosServicios.forEach(nuevoServicio => {
            updatedServicios.push(nuevoServicio);
        })

        // Realiza la actualización en la base de datos        
        const updatedServicio = await citas.findByIdAndUpdate(
            { _id: _id },
            { Servicios: updatedServicios, FechaCita, HoraCita, horaInicioCitaDB, horaFinCitaDB, Descripcion, Estado },
            { new: true }
        );

        res.json({
            msg: "Cita actualizada exitosamente",
            cita: updatedServicio
        });
    } else {
        res.status(400).json({ error: 'La propiedad servicos debe ser un array' });
    }
};



const patchcitas = async (req, res) => {
    const { _id, ConfirmarCita, Estado } = req.body
    const Cita1 = await citas.findOneAndUpdate({ _id: _id }, { Estado: Estado, ConfirmarCita: ConfirmarCita })
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
