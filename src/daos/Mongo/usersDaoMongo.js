const { usersModel } = require("./models/users.model")

class UserDaoMongo {
    constructor(){
        this.model = usersModel
    }
    async get(){
        try {
            return await usersModel.find({})
        } catch (error) {
            console.log(Error)
        }
    }
    async getPaginate(){
        try {
            return await usersModel.paginate({ limit, page})
        } catch (error) {
            console.log(Error)
        }
    }
    async getBy(filter){
        try {
            return await this.model.findOne(filter)
        } catch (error) {
            console.log(Error)
        }

    }
    async create(user){
        try {
            return await this.model.create(user)
            
        } catch (error) {            
            console.log(Error)
        }        
    }
    async update(uid, userReplace){
        try {
            const userUpdate = await this.model.updateOne({ _id: uid }, userReplace)
            return userUpdate
          } catch (error) {
            console.error("Error al actualizar usuario", error)
            throw new Error("Error al actualizar usuario")
          }
    }
    async remove(uid){
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