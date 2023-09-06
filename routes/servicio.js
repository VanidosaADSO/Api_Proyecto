const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { postservicio, getservicio, putservicio, patchservicio, deleteservicio } = require('../controllers/servicio');
const uploadMulterConfig = require('../utils/multerConfig'); // Importa la configuración de Multer

// Ruta para crear un nuevo servicio
router.post('/',
  [
      // Validaciones para los campos del servicio
      // check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
      // check('Tiempo', 'El tiempo es obligatorio').not().isEmpty(),
      // check('Precio', 'El precio es obligatorio').not().isEmpty(),
      // check('Descripcion', 'La descripción es obligatoria').not().isEmpty(),
      // validarCampos,
  ],
  uploadMulterConfig.array('Imagen', 5), // Agrega la configuración de Multer para manejar las imágenes
  postservicio
);

router.get('/', getservicio);
router.put('/', putservicio);
router.patch('/', patchservicio);
router.delete('/', deleteservicio);

module.exports = router;
