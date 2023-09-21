const { Router } = require('express');
const router = Router(); // Obtener la funcion router
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')


const { getcitas, postcitas, putcitas, patchcitas, deletecitas } = require("../controllers/cita")

router.get('/', getcitas)

router.post('/', [

    check('Documento', 'EL campo documento es obligatorio').not().isEmpty(),
    check('Nombre', 'EL campo Nombre es obligatorio').not().isEmpty(),
    check('Apellidos', 'EL campo Apellidos es obligatorio').not().isEmpty(),
    check('FechaCita', 'La fecha es obligatoria').not().isEmpty(),
    check('HoraCita', 'La hora es obligatoria').not().isEmpty(),
    validarCampos

], postcitas);


router.put('/', putcitas)

router.patch('/', patchcitas)

router.delete('/', deletecitas)


//exportar módulo
module.exports = router