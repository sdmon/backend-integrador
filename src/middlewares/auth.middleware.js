// Validacion

/* function authentication(req, res, next) {
    if( !req.session?.user?.admin ) {
        return res.status(401).send('Error de autenticacion')
    } 
    return next()
}

module.exports = {
    authentication
} */

exports.authentication = role => {
    return async (req, res, next) => {
        try {
            if (!req.user) return res.status(401).send({status: 'Error', message: 'No autorizado'})
            if (req.user.role === role ) return res.status(403).send({status: 'Error', message: 'No tiene permisos'})
            next()
        } catch (error) {
            next(error)
        }
    }
}