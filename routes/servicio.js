const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { postservicio, getservicio, putservicio, patchservicio, deleteservicio } = require('../controllers/servicio');


const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Ruta para crear un nuevo servicio
router.post(
  '/',
  [
      check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('Tiempo', 'El tiempo es obligatorio').not().isEmpty(),
      check('Precio', 'El precio es obligatorio').not().isEmpty(),
      check('Descripcion', 'La descripcion es obligatoria').not().isEmpty(),
      validarCampos,
  ],
  upload.single('Imagen'), // Utiliza el mismo nombre 'Imagen' que en el formData
  postservicio
);

router.get('/', getservicio);
router.put('/', putservicio);
router.patch('/', patchservicio);
router.delete('/', deleteservicio);

module.exports = router;
