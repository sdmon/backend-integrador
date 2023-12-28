const { Schema, model } = require('mongoose')

const ordersCollection = 'Orders'

const orderSchema = Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        enum:["small", "medium", "large"], // Valores posibles
        default: "medium" // Valor predeterminado si no se indica
    },
    quantity: {
        type: Number,
        required: true,
    },
    atCreated: {
        type: Date,
        default: Date()
    } 
})

const ordersModel = model(ordersCollection, orderSchema)

module.exports = {
    ordersModel
}