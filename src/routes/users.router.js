const { Router } = require("express")
const UserDaoMongo = require("../daos/Mongo/usersDaoMongo")
const router = Router()

const usersService = new UserDaoMongo()

router
  .get("/", async (req, res) => {
    try {
      const users = await usersService.getUsers()
      res.send({
        status: "Exito",
        payload: users,
      })
    } catch (error) {
      console.log(error)
    }
  })
  .get("/uid", async (req, res) => {
    try {
        const { uid } = req.params

        const user = await usersService.getUser(uid)
    
        if (!user) {
          return res.status(404).json({ error: "Usuario no encontrado." })
        }
    
        res.status(200).send({
          status: "Exito!",
          payload: user,
        })

      } catch (error) {
        console.error("Error al obtener usuario", error)
        res.status(500).json({ error: "Error de servidor" })
      }
  })
  .post("/", async (req, res) => {
    try {
      const { first_name, last_name, email } = req.body

      if (!first_name || !last_name || !email) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos." })
      }
      const userCreate = await usersService.createUser({
        first_name,
        last_name,
        email,
      })
      console.log(first_name, last_name, email)

      res.status(201).send({
        status: "Exito!",
        payload: userCreate,
      })
    } catch (error) {
      console.error("Error al crear usuario", error)
      res.status(500).json({ error: "Error de servidor" })
    }
  })
  .put("/:uid", async (req, res) => {
    try {
      const { uid } = req.params
      const userReplace = req.body

      try {
        const userUpdate = await usersService.updateUser(uid, userReplace)

        res.status(201).send({
          status: "Exito!",
          payload: userUpdate,
        })
      } catch (updateError) {
        console.error("Error al actualizar usuario", updateError)
        res.status(500).json({ error: "Error al actualizar usuario" })
      }
    } catch (error) {
      console.error("Error en la solicitud", error)
      res.status(500).json({ error: "Error de servidor" })
    }
  })
  .delete("/uid", async (req, res) => {
    const { uid } = req.params
    const userDelete = await usersService.deleteUser({ _id: uid })

    return res.status(200).json({
      status: "Exito!",
      data: userDelete,
    })
  })

module.exports = router
