const { prodModel } = require("./models/products.model.js")

class ProductDaoMongo {
    constructor(){
        this.model = prodModel
    }
    
    
    async get(){
        try {
            return await this.model.find({})
        } catch (error) {
            console.log('Error al buscar productos' + error)
        }
    }
    async getBy(filter){
        try {            
            return await this.model.findOne(filter)
        } catch (error) {
            console.log('Error al buscar el id' + error)
            
        }

    }
    async create(product){
        try {            
            return await this.model.create(product)
        } catch (error) {
            console.log('Error en la creacion de producto' + error)            
        }       
    }
    async update(pid, prodReplace) {
        try {           
            const productUpdate = await this.model.updateOne({ _id: pid }, prodReplace)
            return productUpdate
        } catch (error) {
            console.error('Error al actualizar el producto', error)
            throw error 
        }
    }
    async remove(pid){
        try {            
            const prodDelete = await this.model.deleteOne({ _id: pid })
            return prodDelete
        } catch (error) {
            console.error('Error al eliminar el producto', error)            
        }
    }
}

module.exports = ProductDaoMongo