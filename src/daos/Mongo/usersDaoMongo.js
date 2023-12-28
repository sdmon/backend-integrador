const { usersModel } = require("./models/users.model")

class UserDaoMongo {
    constructor(){
        this.model = usersModel
    }
    async getUsers(){
        try {
            return await usersModel.paginate({})
        } catch (error) {
            console.log(Error)
        }
    }
    async getUser(uid){
        try {
            return await this.model.findOne({_id: uid})
        } catch (error) {
            console.log(Error)
        }

    }
    async createUser(user){
        try {
            return await this.model.create(user)
        } catch (error) {
            console.log(Error)
        }        
    }
    async updateUser(uid, userReplace){
        try {
            const userUpdate = await this.model.updateOne({ _id: uid }, userReplace)
            return userUpdate
          } catch (error) {
            console.error("Error al actualizar usuario", error)
            throw new Error("Error al actualizar usuario")
          }
    }
    async deleteUser(uid){
        try {
            const userDelete = await this.model.deleteOne({ _id: uid })
            return userDelete
          } catch (error) {
            console.error("Error al eliminar usuario", error)
            throw new Error("Error al eliminar usuario")
          }
    }
}

module.exports = UserDaoMongo