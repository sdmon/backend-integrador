const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

// Coleccion
const productCollection = 'Productos'

// Schema
const ProdSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true,        
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
    
})

ProdSchema.plugin(mongoosePaginate)
const prodModel = model(productCollection, ProdSchema)

module.exports = {
    prodModel
}