const { json } = require("body-parser")
const rols = require("../models/rol")

const getRol = async (req, res) => {
    const rol = await rols.find()

    res.json({
        rol
    })
}

const postrol = async (req, res) => {

    const { Nombre, Permisos, Estado } = req.body

    const rol1 = new rols({ Nombre, Permisos, Estado })
    await rol1.save()

    res.json({
        rol1
    })

}

const putrol = async (req, res) => {

    const { _id, Nombre, Permisos, Estado } = req.body

    if (Permisos && Array.isArray(Permisos)) {
        const rol = await rols.findOne({ _id: _id });
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        const updatedPermisos = rol.Permisos.map(existingRol => {
            const RolData = Permisos.find(p => p._id && p._id.toString() === existingRol._id.toString());
            if (RolData) {
                if (RolData.eliminar) {
                    return null;
                }
                const updatedPermiso = { ...existingRol.toObject(), ...RolData };
                return updatedPermiso
            }
            return existingRol;
        }).filter(permiso => permiso !== null)
        // Agregar nuevo permiso
        const nuevospermisos = Permisos.filter(p => !p._id);
        nuevospermisos.forEach(nuevopermiso => {
            updatedPermisos.push(nuevopermiso);
        })

        // Realizar la catualizacion en la base de datos 
        const updatedPermiso = await rols.findByIdAndUpdate(
            { _id: _id },
            { Nombre: Nombre, Permisos: updatedPermisos, Estado: Estado },
            { new: true }
        );
        res.json({
            msg: "Rol actualizado exitosamente",
            rol: updatedPermiso
        })


    } else {
        res.status(400).json({ error: 'La propiedad Permiso debe ser un array' });
    }
}

const patchrol = async (req, res) => {
    const { _id, Estado } = req.body
    const rol1 = await rols.findOneAndUpdate({ _id: _id }, { Estado: Estado })
    res.json({
        rol1
    })
}

const deleterol = async (req, res) => {
    const { _id } = req.query

    const rol1 = await rols.findOneAndDelete({ _id: _id })

    res.json({
        rol1
    })
}

module.exports = {
    getRol,
    postrol,
    putrol,
    patchrol,
    deleterol
}