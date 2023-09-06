const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { postservicio, getservicio, putservicio, patchservicio, deleteservicio } = require('../controllers/servicio');
// const fileUpload = require('express-fileupload');
// const multer = require('./multerConfig');

// Ruta para crear un nuevo servicio
router.post(
  '/',
  // fileUpload,
  [
      check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('Tiempo', 'El tiempo es obligatorio').not().isEmpty(),
      check('Precio', 'El precio es obligatorio').not().isEmpty(),
      check('Descripcion', 'La descripcion es obligatoria').not().isEmpty(),
      validarCampos,
  ],
  postservicio
);

router.get('/', getservicio);
router.put('/', putservicio);
router.patch('/', patchservicio);
router.delete('/', deleteservicio);

module.exports = router;
