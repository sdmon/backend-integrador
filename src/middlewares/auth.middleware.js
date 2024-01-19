// Validacion

function authentication(req, res, next) {
    if( !req.session?.user?.admin ) {
        return res.status(401).send('Error de autenticacion')
    } 
    return next()
}

module.exports = {
    authentication
}