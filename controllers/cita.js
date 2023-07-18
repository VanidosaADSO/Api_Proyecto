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
    const { _id, Servicio, FechaCita, HoraCita, Descripcion, Estado } = req.body;

    const Cita1 = await citas.findOneAndUpdate({ _id: _id }, { Servicio: Servicio, FechaCita: FechaCita, HoraCita: HoraCita, Descripcion: Descripcion, Estado: Estado });
    res.json({
        msg: "Cita actualizada exitosamente",
        Cita: Cita1
    });

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
