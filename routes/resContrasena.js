const { Router } = require('express')
const router = Router()

const { postOlvidocontrasena, patchContrasena } = require('../controllers/resContrasena')

router.post('/', postOlvidocontrasena)
router.patch('/', patchContrasena)


module.exports = router