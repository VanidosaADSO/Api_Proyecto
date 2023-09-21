const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')

const { getRol, postrol, putrol,patchrol, deleterol } = require('../controllers/rol')

router.get('/', getRol)

router.post('/', [
    check('Nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    
    validarCampos
],
    postrol)

router.put('/', putrol)

router.patch('/', patchrol)

router.delete('/', deleterol)


module.exports = router