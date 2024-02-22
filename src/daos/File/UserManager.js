const fs = require("node:fs")

const path = "./src/mocks/Usuarios.json"

class UserManager {
  constructor() {
    this.path = path
  }

  readFile = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  get = async () => {
    try {
      return await this.readFile()
    } catch (error) {
      return "Aun no hay usuarios"
    }
  }

  getBy = async (filter) => {
    try {
      const users = await this.readFile()

      if (!users || users.length === 0) {
        return "No hay usuarios"
      }

      const user = users.find((user) => {
        return user.id === filter
      })

      if (!user) {
        return "No hay un usuario con esa id"
      }

      return user
    } catch (error) {
      return new Error(error)
    }
  }

  create = async (newUser) => {
    try {
      let users = await this.readFile()

      const usr = users.find((item) => item.username === newUser.username)
      if (usr) {
        return `El usuario ya existe`
      }

      if (users.length === 0) {
        // Si no hay un usuario arranca el id de 1
        newUser.id = 1
        users.push(newUser)
      } else {
        // Si el array ya tiene objetos le sumo uno al total del array y lo guardo como id del usuario
        users = [
          ...users,
          {
            ...newUser,
            id: String(
              users.length > 0
                ? Number(users[users.length - 1].id) + 1
                : 1
            ),
          },
        ]
      }
      // Si no existe el archivo se crea y lo escribimos en JSON
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(users, null, 2),
        "utf-8"
      )

      return "Usuario agregado"
    } catch (error) {
      return new Error(error)
    }
  }

  async update(uid, updateUser) {
    try {
      let users = await this.readFile()

      const index = users.findIndex((user) => user.id === uid)
      if (index !== -1) {
        updateUser.id = uid
        users[index] = updateUser

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(users, null, 2),
          "utf-8"
        )

        return "Usuario actualizado"
      } else {
        return null
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  remove = async (id) => {
    try {
      let users = await this.readFile()
      // Busco el index
      const index = users.findIndex((user) => user.id === id)
      // Si es distinto a -1 lo borro
      if (index !== -1) {
        users.splice(index, 1)
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(users, null, 2),
          "utf-8"
        )
        return "Usuario eliminado"
      } else {
        return null
      }
    } catch (error) {
      return new Error(error)
    }
  }
}

module.exports = UserManager