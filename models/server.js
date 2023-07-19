const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { dbConnetion } = require('../database/config')
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar las imágenes en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: './uploads', // Carpeta donde se guardarán las imágenes
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Middleware de multer para procesar la carga de imágenes
const upload = multer({ storage });

class Server {
    
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuario'
        this.authPath = '/api/auth'
        this.proveedoresPath = '/api/proveedor'
        this.comprasPath = '/api/compra'
        this.servicioPath = '/api/servicio'
        this.insumosPath = '/api/insumo'
        this.citasPath = '/api/cita'
        this.rolPath = '/api/rol'
        this.conetarDB()
        this.middlewares()
        this.routes()
    }
    async conetarDB() {
        await dbConnetion()
    }

    middlewares() {
        this.app.use(cors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204
        }))

        upload.single('Imagen'), // Agregar el middleware de multer para cargar la imagen

        this.app.use(bodyParser.json())
        this.app.use(express.static('public'))

        this.app.use(express.json())
    }
  

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuario'));
        this.app.use(this.proveedoresPath, require('../routes/proveedor'));
        this.app.use(this.comprasPath, require('../routes/compra'));
        this.app.use(this.servicioPath, require('../routes/servicio'));
        this.app.use(this.insumosPath, require('../routes/insumo'));
        this.app.use(this.citasPath, require('../routes/cita'));
        this.app.use(this.rolPath, require('../routes/rol'));
    }

    listen() {
        this.app.listen(this.port, (req, res) => {
            console.log(`Escuchando el puerto ${this.port}`)
        })
    }

}

module.exports = Server