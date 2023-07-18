const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')

const { getProveedor, postProveedor, putProveedores,patchProveedor, deleteProveedor } = require('../controllers/proveedor')

router.get('/', getProveedor)

router.post('/', [
    check('Nombre', 'El nombre es un campo obligatorio').not().isEmpty(),

    check('Apellido', 'El apellido es un campo obligatorio').not().isEmpty(),

    check('Correo', 'El correo no es valido').isEmail(),

    check('Ciudad', 'La ciudad es un campo obligatorio').not().isEmpty(),

    check('Direccion', 'La direccion es un campo obligatorio').not().isEmpty(),

    check('Telefono', 'El telefono debe de tener minimo 10 digitos').isLength({ min: 10 }),

    check('Nit', 'El nit es debe de tener minimo 10 digitos').isLength({ min: 10 }),

    // check('Estado', 'El estado es un campo obligatorio').not().isEmpty(),


    validarCampos
],
    postProveedor)

router.put('/', putProveedores)

router.patch('/', patchProveedor)

router.delete('/', deleteProveedor)


module.exports = router