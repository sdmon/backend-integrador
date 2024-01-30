const { Router } = require("express")
const { authentication } = require("../middlewares/auth.middleware.js")
const router = Router()
const { usersModel } = require("../daos/Mongo/models/users.model.js")
const { createHash, isValidPassword } = require("../utils/hashPassword.js")
const passport = require("passport")
const { generateToken, authToken } = require("../utils/jwt.js")
const { passportCall } = require("../utils/passportCall.js")
const {
  authorizationJWT,
} = require("../middlewares/jwtPassport.middleware.js")

router.get("/", (req, res) => {
  try {
    if (req.session.counter) {
      req.session.counter++
      res.send(`Bienvenido! Cantidad de visitas ${req.session.counter}`)
    } else {
      req.session.counter = 1
      res.send("E-commerce")
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Error de session")
  }
})

// Estrategia 1
/*
 router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body

    if (!first_name || !last_name || !email || !password || !role ) {
      return res.send('Todos los campos son obligatorios')
    }
    
    const user = await usersModel.findOne({ email })
    if (user) {
      return res.send({ status: 'Error', error: 'Ya existe un usuario con ese email' })
    }    

    const newUser = {
      first_name,
      last_name,
      email,
      password: createHash(password),
      role,
    }        

    const result = await usersModel.create(newUser)   

    res.send({
      status: 'success',
      payload: {
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          _id: result._id
      }
  })

  } catch (error) {
    console.error(error)
    res.status(500).send('Error al registrarse')
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (email === '' || password === '') {
      return res.send('Todos los campos son obligatorios!')
    }

    const user = await usersModel.findOne({ email })

    if (!user) {
      return res.send('Email incorrecto!')
    }

    if (user.password && isValidPassword(password, user.password)) {
      req.session.user = {
        user: user._id,
        first_name: user.first_name,
        role: user.role,
      }
      return res.json('Usuario logueado!')
    } else if (password === user.password) {
      req.session.user = {
        user: user._id,
        first_name: user.first_name,
        role: user.role,
      }
      return res.json('Usuario logueado!')
    } else {
      return res.send('Password incorrecto!')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al loguear')
  }
}) 
*/
// Estrategia 2
/* router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}),(req, res)=>{
  res.json({status: 'Success', message: 'Usuario creado con exito!'})
})

router.get('/failregister', (req, res) => {
  console.log('Fail')
  res.send({status: 'error', error: 'Error de registro'})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async (req, res)=>{
  if(!req.user) return res.status(400).send({status: 'Error', error: 'Email o password incorrectos!'})
  req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
      role: req.user.role,
  }
  res.redirect('/products')
})
router.get('/faillogin', (req, res) => {
  res.send({error: 'failed login'})
})
 */

// Estrategia 3

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body

    if (!first_name || !last_name || !email || !password || !role) {
      return res.send("Todos los campos son obligatorios")
    }

    const user = await usersModel.findOne({ email })
    if (user) {
      return res.send({
        status: "Error",
        error: "Ya existe un usuario con ese email",
      })
    }

    const newUser = {
      first_name,
      last_name,
      email,
      password: createHash(password),
      role,
    }

    await usersModel.create(newUser)
    const token = generateToken({ id: result._id })

    res
      .cookie("token", token, {
        maxAge: 60 * 60 * 100 * 24,
      })
      .send({
        status: "success",
        payload: {
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          _id: result._id,
        },
      })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al registrarse")
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (email === "" || password === "") {
      return res.send("Todos los campos son obligatorios!")
    }

    const user = await usersModel.findOne({ email })

    if (!user) {
      return res.send("Email incorrecto!")
    }

    if (user.password && isValidPassword(password, user.password)) {
      const token = generateToken({ id: user._id, role: user.role })

      req.session.user = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      }

      res
        .cookie("token", token, {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true,
        })
        /* .json({
          status: "Success",
          payload: {
            user: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          },
        }) */
        res.redirect('/products')
    } else if (password === user.password) {
      const token = generateToken({ id: user._id, role: user.role })
      return res
        .cookie("token", token, {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true,
        })
        .json({
          status: "Success",
          payload: {
            user: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          },
        })
    } else {
      return res.send("Password incorrecto!")
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al loguear")
  }
})

router.get(
  "/github",
  passport.authenticate(
    "github",
    { scope: ["user:email"] },
    async (req, res) => {}
  )
)

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user
    res.redirect("/")
  }
)

router.get(
  "/current",
  passportCall("jwt"),
  authorizationJWT("user", "admin"),
  (req, res) => {
    res.send({ message: "Solo administrador", reqUser: req.user })
  }
)

router.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.send({ status: "error", error: err })
    })
    res.send("Logout exitoso!")
  } catch (error) {
    console.error(error)
    res.status(500).send("Error al desloguear")
  }
})

module.exports = router
