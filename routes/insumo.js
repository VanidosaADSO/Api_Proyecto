const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')

const { getinsumos, postinsumos, putinsumos, patchinsumos, descontarInsumo, deleteinsumos } = require('../controllers/insumo')

router.get('/', getinsumos)

router.post('/', [
    check('Nombre', 'El nombre es un campo obligatorio').not().isEmpty(),

    check('Unidad_Medida', 'La unidad de medida es un campo obligatorio').not().isEmpty(),

    // check('Estado', 'El estado es un campo obligatorio').not().isEmpty(),

    validarCampos
],

    postinsumos)

router.put('/', putinsumos)

router.patch('/', patchinsumos)

router.patch('/descontar', descontarInsumo)

router.delete('/', deleteinsumos)

module.exports = router