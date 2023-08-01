const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { dbConnetion } = require('../database/config')

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
        this.OlvidocontrasenaPath = '/api/olvidocontrasena'
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
        this.app.use(this.OlvidocontrasenaPath, require('../routes/resContrasena'));
    }

    listen() {
        this.app.listen(this.port, (req, res) => {
            console.log(`Escuchando el puerto ${this.port}`)
        })
    }

}

module.exports = Server