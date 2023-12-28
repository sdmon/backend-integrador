const { prodModel } = require("./models/products.model.js")

class ProductDaoMongo {
    constructor(){
        this.model = prodModel
    }
    validateId(id) {
        if (!id || typeof id !== 'string') {
            throw new Error('Formato invalido')
        }
    }
    
    async getProducts(){
        try {
            return await this.model.find({})
        } catch (error) {
            console.log('Error al buscar productos' + error)
        }
    }
    async getProduct(pid){
        try {
            this.validateId(pid)
            return await this.model.findOne({ _id: pid })
        } catch (error) {
            console.log('Error al buscar el id' + error)
            
        }

    }
    async createProduct(product){
        try {            
            return await this.model.create(product)
        } catch (error) {
            console.log('Error en la creacion de producto' + error)            
        }       
    }
    async updateProduct(pid, prodReplace){
        try {
            this.validateId(pid)            
            const productUpdate = await this.model.updateOne({ _id: pid }, prodReplace)
            return productUpdate
        } catch (error) {
            console.error('Error al actualizar el producto', error)            
        }
    }
    async deleteProduct(pid){
        try {
            this.validateId(pid)
            const prodDelete = await this.model.deleteOne({ _id: pid })
            return prodDelete
        } catch (error) {
            console.error('Error al eliminar el producto', error)            
        }
    }
}

module.exports = ProductDaoMongo