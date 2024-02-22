require('dotenv').config()
const passport = require('passport')
//const local = require('passport-local')
const UserDaoMongo = require('../daos/Mongo/usersDaoMongo')
const { createHash, isValidPassword } = require('../utils/hashPassword')
const GithubStrategy = require('passport-github2')
const jwt = require('passport-jwt')

const JWTStrat = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
// login y registro
// const LocalStrategy = local.Strategy
const userService = new UserDaoMongo()

// Estrategia = middleware. Recibe un objeto y callback
exports.initializePassport = () => {
    // Estrategia Passport JWT
    const cookieExtractor = req => {
        let token = null
        if(req && req.cookies) {
            token = req.cookies['token']
        }
        return token
    }

    passport.use('jwt', new JWTStrat({
        // Funcion para extraer el token y clave secreta
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'CoderSecretoJesonWebToken'
    }, async (jwt_payload, done) => {          
       
        try {
            //done(null, false, {message: 'Error'} )
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
    //Github

    const randomPassword = (length) => {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        let password = ''
    
        for (let i = 0 ; i < length ; i++) {
            const index = Math.floor(Math.random() * characters.length)
            password += characters.charAt(index)
        }    
        return password
    }

    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {                    
            
            let user = await userService.getUser({email: profile.emails[0].value})
            if (!user) {

                let random = randomPassword(10)

                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: profile.emails[0].value,
                    password: random,
                    role: 'user'
                }                
                let result = await userService.createUser(newUser)
                console.log(result)
                return done(null, result)
            }
            done(null, user)

        } catch (error) {
            console.error('Error de autenticacion:', error)
            done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUser({_id: id})
        done(null, user)
    })
    
    // ---------------------------------- Estrategia clase 19 passport ----------------------------------------------------------

    /* passport.use('register', new LocalStrategy({
        passReqToCallback: true, // Aceptar llamada del request
        usernameField: 'email' // Pasamos el email como field de username
    }, async (req, username, password, done) => {
        try{
            const { first_name, last_name, email } = req.body
            let user = await userService.getUser({email: username})
            if (user) return done(null, false)

            let newUser = {
                first_name,
                last_name,
                email: username,
                password: createHash(password)
            }
            let result = await userService.createUser(newUser)
            return done(null, result)
        } catch (error) {
            return done('Error al crear un usuario' +error)
        }
    })) 

    passport.use('login', new LocalStrategy({        
        usernameField: 'email',
    }, async (username, password, done)=> {
        try {
            const user = await userService.getUser({email: username})
            if (!user) {
                console.log('Usuario inexistente')
                return done(null, false)                
            }
            if (user.password && (isValidPassword(password, user.password) || password === user.password)) {
                return done(null, user)              
              } else {
                return done(null, false)
              }
        } catch (error) {
            return done(error)           
        }
    })) */
}