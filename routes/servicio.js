const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { getservicio, postservicio, putservicio, patchservicio, deleteservicio } = require('../controllers/servicio')

router.get('/', getservicio)

router.post('/', [
    check('Nombre', 'El nombre es obligatorio').not().isEmpty(),

    check('Tiempo', 'El tiempo es obligatorio').not().isEmpty(),

    check('Precio', 'El precio es obligatorio').not().isEmpty(),

    check('Descripcion', 'La descripcion es obligatoria').not().isEmpty(),

    check('Imagen', 'La imagen es obligatoria'),

    // check('Estado', 'El estado es obligatorio').not().isEmpty(),

    validarCampos
], postservicio)

router.put('/', putservicio)

router.patch('/', patchservicio)

router.delete('/', deleteservicio)


module.exports = router