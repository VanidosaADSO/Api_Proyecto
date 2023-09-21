const { Router } = require('express');
const router = Router();
const { postservicio, getservicio, obtenerImagen, putservicio, patchservicio, deleteservicio } = require('../controllers/servicio');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

// Ruta para crear un nuevo servicio
router.post('/',
  [
    // Validaciones para los campos del servicio
    check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('Tiempo', 'El tiempo es obligatorio').not().isEmpty(),
    check('Precio', 'El precio es obligatorio').not().isEmpty(),
    check('Descripcion', 'La descripción es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  postservicio
);

router.get('/', getservicio);

router.get('/obtenerImagen/:id', obtenerImagen);

router.put('/', putservicio);

router.patch('/', patchservicio);

router.delete('/', deleteservicio);

module.exports = router;
