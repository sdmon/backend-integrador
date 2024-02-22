const { UserDto } = require("../DTO/usersDto")
const { UserDao } = require("../daos/factory")

class UserRepository {
    constructor(){
        this.dao = new UserDao()
    }

        get = async () => await this.dao.get()
        getBy = async (filter) => await this.dao.getBy(filter)
        create = async (newUser) => {
            const newUserDto = new UserDto(newUser)
            return await this.dao.create(newUserDto)
        }
        update = async (uid, userUpdate) => this.dao.update(uid, userUpdate)
        remove = async (uid) => this.dao.remove(uid) 
}

module.exports = {
    UserRepository
}