const { usersService } = require('../repositories/service.js')

class UserController {
    constructor(){
        this.usersService = usersService
    }
  get = async (req, res) => {
    try {
      const users = await this.usersService.get()
      res.send({
        status: "Exito",
        payload: users,
      })
    } catch (error) {
      console.log(error)
    }
  }

  create = async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body
      
      if (!first_name || !last_name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos." })
      }
      
      const result = await this.usersService.getBy({ email })
        if (result) {
            return res
                .status(400)
                .json({ error: "Ya existe un usuario con este email." })
      }
      
      const newUser = { first_name, last_name, email, password }      
      const userCreate = await this.usersService.create(newUser)

      console.log(first_name, last_name, email)

      res.status(201).send({
        status: "Exito!",
        payload: userCreate,
      })
    } catch (error) {
      console.error("Error al crear usuario", error)
      res.status(500).json({ error: "Error de servidor" })
    }
  }

  getBy = async (req, res) => {
    try {
      //const filter = req.query
      const { uid } = req.params
      const user = await this.usersService.getBy({_id: uid})      

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
  }

  update = async (req, res) => {
    try {
      const { uid } = req.params
      const userReplace = req.body

      try {
        const userUpdate = await this.usersService.update(
          { _id: uid },
          userReplace
        )

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
  }

  remove = async (req, res) => {
    const { uid } = req.params
    const userDelete = await this.usersService.remove({ _id: uid })

    return res.status(200).json({
      status: "Exito!",
      data: userDelete,
    })
  }
}

module.exports = UserController
