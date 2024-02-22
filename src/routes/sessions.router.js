const { Router } = require("express")
const router = Router()
const { usersModel } = require("../daos/Mongo/models/users.model.js")
const { createHash, isValidPassword } = require("../utils/hashPassword.js")
const passport = require("passport")
const { generateToken } = require("../utils/jwt.js")
const { passportCall } = require("../utils/passportCall.js")
const { authorizationJWT } = require("../middlewares/jwtPassport.middleware.js")

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

router.post("/register", async (req, res) => {
  try {
    const { fullname, first_name, last_name, email, password, role } = req.body

    if (!fullname, !first_name || !last_name || !email || !password || !role) {
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
      fullname,
      first_name,
      last_name,
      email,
      password: createHash(password),
      role,
    }

    await usersModel.create(newUser)
    const token = generateToken({ id: newUser._id })

    res
      .cookie("token", token, {
        maxAge: 60 * 60 * 100 * 24,
      })
      .send({
        status: "success",
        payload: {
          fullname: newUser.first_name + newUser.last_name,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          role: newUser.role,
          _id: newUser._id,
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
      return res.status(400).json({ error: "Todos los campos son obligatorios!" })
    }

    const user = await usersModel.findOne({ email })

    if (!user) {
      return res.status(401).json({ error: "Email incorrecto!" })
    }

    if (user.password && isValidPassword(password, user.password)) {
      const token = generateToken({ id: user._id, role: user.role })
      console.log(token)

      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })

      res.status(200).json({
        status: "Success",
        payload: {
          user: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        },
      })
    } else {
      return res.status(401).json({ error: "Password incorrecto!" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al loguear" })
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

router.get( "/current", passportCall("jwt"), authorizationJWT(["admin"]), (req, res) => {
    res.send({ message: "Solo administrador", reqUser: req.user })
  }
)

router.post("/logout", (req, res) => {
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
