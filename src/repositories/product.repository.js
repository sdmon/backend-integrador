const { ProductDto } = require("../DTO/productsDto")
const { ProductDao } = require("../daos/factory.js")


class ProductRepository {
    constructor(){
        this.dao = new ProductDao()
    }

        get = async () => await this.dao.get()
        getBy = async (filter) => await this.dao.getBy(filter)
        create = async (newProduct) => {
            const newProductDto = new ProductDto(newProduct)
            return await this.dao.create(newProductDto)
        }
        update = async (pid, productToUpdate) => this.dao.update(pid, productToUpdate)
        remove = async (pid) => this.dao.remove(pid) 
}

module.exports = {
    ProductRepository
}