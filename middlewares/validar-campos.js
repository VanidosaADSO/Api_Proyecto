const { validationResult } = require('express-validator')

const validarCampos = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty() ) {
        return res.status(400).json(errors)
    }

    next(); //Continuar con la siguiente validacion o instruccion 
    
}

module.exports = {
    validarCampos
}