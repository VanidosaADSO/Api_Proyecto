const {Router} = require('express')
const router = Router()
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')

const { getUsuario, postUsuario, putUsuario, patchUsuario, deleteUsuario } = require('../controllers/usuario')

router.get('/',getUsuario)

router.post('/',[
    check('Nombre', 'El nombre es un campo obligatorio').not().isEmpty(),

    check('Apellido', 'El apellido es un campo obligatorio').not().isEmpty(),

    check('Tipo_Documento', 'El tipo de documento es un campo obligatorio').not().isEmpty(),

    check('Documento', 'El documento debe tener minimo 8 dijitos').isLength({min: 8}),

    check('Direccion', 'La direccion es un campo obligatorio').not().isEmpty(),

    check('Telefono', 'El telefono debe tener minimo 10 dijitos').isLength({min: 10}),

    check('Correo', 'El correo no es valido').isEmail(),

    check('Contrasena', 'La contraseña debe contener minimo 8 caracteres').isLength({min: 8}),

    check('Rol', 'El rol no es valido').isIn(['Administrador', 'Empleado','Cliente']),

    // check('Estado', 'El estado es un campo obligatorio').not().isEmpty(),

    validarCampos
], postUsuario)

router.put('/',putUsuario)

router.patch('/',patchUsuario)

router.delete('/',deleteUsuario)

module.exports = router