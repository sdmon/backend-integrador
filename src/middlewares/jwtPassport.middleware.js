exports.authorizationJWT = (roles) => {
    return async (req, res, next) => {
      try {
        if (!req.user) return res.status(401).json({ error: 'No autorizado' })
  
        const userRole = req.user.role        
              
        if (roles.includes(userRole)) {          
          next()
        } else {
          res.status(403).json({ error: 'Usuario sin permiso' })
        }
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error de servidor' })
      }
    }
  }