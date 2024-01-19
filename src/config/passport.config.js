const passport = require('passport')
const local = require('passport-local')
const UserDaoMongo = require('../daos/Mongo/usersDaoMongo')
const { createHash, isValidPassword } = require('../utils/hashPassword')
const GithubStrategy = require('passport-github2')

// login y registro
const LocalStrategy = local.Strategy
const userService = new UserDaoMongo()

// Estrategia = middleware. Recibe un objeto y callback
exports.initializePassport = () => {

    // Estrategia GitHub
    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.02d586aa2c93bd13',
        clientSecret: '584c89a6744ea7e95351cf29dff3774be7b68dc3',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)            
            console.log(profile.username, profile._json.email)
            let user = await userService.getUser({username: profile.username})
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: 'seba@sebita.com',
                    password: '123456',
                    role: 'user'
                }                
                let result = await userService.createUser(newUser)
                console.log(result)
                return done(null, result)
            }
            done(null, user)

        } catch (error) {
            console.error('Error during GitHub authentication:', error)
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
    
    /* Estrategia clase 19 passport

    passport.use('register', new LocalStrategy({
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