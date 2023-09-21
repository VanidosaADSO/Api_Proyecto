const citas = require('../models/cita')
const usuario = require('../models/usuario')
const insumos = require('../models/insumo')
const servicios = require('../models/servicio');

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
        <div style="
    font-family: Arial, Helvetica, sans-serif; 
    display: flex;
    justify-content: center;
    border: 1px solid;
  ">

    <style>
      * {
        box-sizing: border-box;
        margin: 0px;
        padding: 0px;
      }

      @media screen and (min-width: 1024px) {
        .container-main {
          width: 50% !important;
          margin: 1em 0 !important;
        }
      }

      @media screen and (max-width: 1024px) {
        .container-main {
          width: 96% !important;
          margin: 1em 0 !important;
        }
      }

      @media screen and (max-width: 600px) {
        .container-main {
          width: 96% !important;
          margin: 1em 0 !important;
        }

        .logo {
          width: 130px !important;
        }

        .title-name {
          font-size: 18px !important;
        }

        h3 {
          font-size: 17px !important;
        }

        h4 {
          font-size: 15px !important;
        }

        .text,
        li {
          font-size: 14px !important;
        }

        .text-vanidosa {
          font-size: 12px !important;
        }
      }
    </style>

    <div class="container-main" style="
      padding: 2em;
      border-radius: 10px;
      background-color: #273746; 
    ">

    <div style="width: 100%; margin: 20px 0; text-align: center;">
       <img class="logo" src="cid:logo@unique_cid" alt="Logo Vanidosa SPA" style="width: 140px; color: #ffffff;">
    </div>

      <h2 class="title-name" style="text-align: center; font-size: 22px; color: #ffffff;">Estimado/a<br>${Nombre + ' '
      + Apellidos}<br><br>
      </h2>

      <p class="text" style="text-align: center; font-size: 15px; color: #ffffff;">
        ¡Nos complace confirmar tu cita en nuestro relajante SPA! Estamos emocionados de recibirte y
        proporcionarte una experiencia rejuvenecedora y revitalizante.
      </p>

      <h3 style="margin-top: 10px; text-align: center; color: #ffffff;">
        A continuacion los detalles de tu cita:
      </h3>

      <p class="text" style="margin-top: 20px; font-size: 15px; color: #ffffff;">
        Fecha: ${fechaFormateada}<br>
        Hora: ${HoraCita}<br><br>
      </p>

      <h4 style="color: #ffffff;">
        Servicios reservados:<br><br>
      </h4>

      <ul style="font-size: 15px; color: #ffffff;">
        ${Servicios.map(servicio => `<li>${servicio.Nombre}</li>`).join('')}<br><br>
      </ul>

      <h4 style="text-align: center; color: #ffffff;">
        Si no puedes asistir, es importante tener en cuenta:<br><br>
      </h4>

      <ol style="font-size: 15px; color: #ffffff;">
        <li>
          Para cancelar la cita, debe hacerlo mínimo tres (3) horas antes de la hora programada.
        </li>
        <li>
          Debe comunicarse al siguiente número telefónico: +57 3136871870
        </li>
        <li>
          No asistir a la cita, sin previo aviso tendrá una sanción de dos (2) semanas sin acceso a servicios.
        </li>
      </ol>

      <div style="margin-top: 20px;">
        <p class="text-vanidosa" style="text-align: center; font-size: 13px; color: #ffffff;">
          Saludos, Vanidosa SPA<br>
          Calle 101 # 18 - 80, Barrio Varenillo, Turbo Antioquia<br>
          +573136871870
        </p>
      </div>

    </div>

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
  const { _id, ConfirmarCita, Estado } = req.body;

  if (ConfirmarCita) {
    await citas.findByIdAndUpdate(
      { _id: _id },
      { ConfirmarCita: ConfirmarCita })
  }else{
    await citas.findByIdAndUpdate(
      { _id: _id },
      { Estado: Estado })
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
