const jwt = require('jsonwebtoken')
const JWT_PRIVATE_KEY = "CoderSecretoJesonWebToken"

const generateToken = user => jwt.sign(user, JWT_PRIVATE_KEY, {expiresIn: '1d'})

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    if (!authHeader) res.status(401).json({stauts: 'Error', error: 'No autenticado'})
    
    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_PRIVATE_KEY, (err, userDecode)=>{
        if(err) return res.status(401).json({status: 'Error', error: 'No autorizado'})
        // console.log(userDecode)
        req.user = userDecode
        next()
    })
}

module.exports = {
    generateToken,
    authToken,
    JWT_PRIVATE_KEY
}