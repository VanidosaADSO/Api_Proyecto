const { Router } = require('express')
const router = Router() //obtener la funcion Router

const{login} = require('../controllers/auth')

router.post('/login', login)


module.exports = router