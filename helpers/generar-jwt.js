const jwt = require('jsonwebtoken')

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        //promesa
        const paylaod = {uid}
        jwt.sign(paylaod, process.env.SECRECTKEY,{
            expiresIn : '1h',
        }, (err, token) => {
            if(err){
                reject('err al generar el token')
            }
            else{
                resolve(token)
            }
        })
    })
}

module.exports = {
    generarJWT
}
