const mongoose =require('mongoose')

const dbConnetion = async()=>{
    try {
        mongoose.connect(process.env.MONGODB_CNN,{})
        console.log('Conexion establecida')
    } catch (error) {
        console.log('Conexion no establecida')
    }
}

module.exports={
    dbConnetion
}