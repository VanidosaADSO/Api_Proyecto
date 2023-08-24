const citas = require('../models/cita')
const usuario = require('../models/usuario')
const insumos = require('../models/insumo')

const nodemailer = require('nodemailer');
const getcitas = async (req, res) => {
    const cita = await citas.find()
    res.json({
        cita
    })

}


const postcitas = async (req, res) => {
    const { Documento, Nombre, Apellidos, Servicios, FechaCita, HoraCita, Fincita, Descripcion, ConfirmarCita, Estado } = req.body
    const Cita1 = new citas({ Documento, Nombre, Apellidos, Servicios, FechaCita, HoraCita, Fincita, Descripcion, ConfirmarCita, Estado })
    await Cita1.save();

    const usuarios = await usuario.findOne({ Documento });

    if (!usuarios) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const fechaCita = new Date(FechaCita);
    const dia = fechaCita.getDate();
    const mes = fechaCita.getMonth() + 1;
    const año = fechaCita.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'AutenticacionVanidosa@gmail.com',
            pass: 'njxbkzuvwqtbbuca'
        }
    });

    const mailOptions = {
        from: 'AutenticacionVanidosa@gmail.com',
        to: usuarios.Correo,
        subject: 'Confirmacion de tu cita',
        attachments: [
            {
                filename: 'logo.png',
                path: __dirname + '/logo.png',
                cid: 'logo@unique_cid'
            }
        ],
        html: `
            <div style="background-color: #273746; padding: 20px;color: #ffffff; margin-left: 200px; margin-right: 200px; border-radius: 10px ">
                <img src="cid:logo@unique_cid" alt="Logo Vanidosa SPA" style="display: block; width: 150px; margin: 0 auto;">
                <center>
                <h2 style="color: #ffffff; font-size:17px;">Estimado/a, ${Nombre + ' ' + Apellidos}</h2>  
                
                <p style="color: #ffffff; font-size:15px;">¡Nos complace confirmar  tu cita en nuestro relajante spa! Estamos emocionados de recibirte y proporcionarte una experiencia rejuvenecedora y revitalizante.</p>
                </center>
                <h3 style="color: #ffffff;">A continuacion los detalles de tu cita:</h3>

                <p style="font-size: 14px; color: #ffffff;">Fecha: ${fechaFormateada}<br>
                Hora: ${HoraCita}<br></p>
                
                <h4 style="color: #ffffff;">Servicios reservados:</h4>
                <ul style="font-size: 14px; color: #ffffff;">
                    ${Servicios.map(servicio => `<li>${servicio.Nombre}</li>`).join('')}
                </ul>
                <br>
                <h4 style="color: #ffffff;">Si no puedes asistir es importante tener en cuenta la siguiente información:</h4>
                <p>1. Para cancelar tu cita debe de ser mínimo tres (3) horas antes de la hora de tu servicio.<br>
                2. Debe comunicarse al siguiente número telefónico: +573136871870.<br>
                3. Si no asistes a tu cita tendrás una sanción de dos (2) semanas sin poder tomar ningún servicio.</p><br>
                <center>
                <p style="font-size: 14px; color: #ffffff;">Saludos, Vanidosa Spa <br>
                Calle101 #18-80 Barrio Varenillo Turbo Antioquia <br>
                +573136871870
                </p>
                </center>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });

    res.json({
        Cita1
    })
};


// Actualizar
const putcitas = async (req, res) => {

    const { _id, Servicios, FechaCita, HoraCita, Fincita, Descripcion, Estado } = req.body;

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
            { Servicios: updatedServicios, FechaCita, HoraCita, Fincita, Descripcion, Estado },
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
    try {
        const { _id, ConfirmarCita, Estado } = req.body;

        // Encontrar la cita a actualizar
        const citaToUpdate = await citas.findOne({ _id: _id });

        if (!citaToUpdate) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Actualizar la cita
        citaToUpdate.Estado = Estado;
        citaToUpdate.ConfirmarCita = ConfirmarCita;
        await citaToUpdate.save();

        // Obtener los productos necesarios de la colección de servicios
        const productosNecesarios = citaToUpdate.Productos;

        // Actualizar la colección de insumos restando las cantidades
        for (const producto of productosNecesarios) {
            const insumo = await insumos.findOne({ Nombre: producto.Nombre });

            if (insumo) {
                insumo.cantidad -= producto.Cantidad;
                await insumo.save();
            }
        }

        res.json({
            message: 'Cita actualizada y productos descontados exitosamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

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
