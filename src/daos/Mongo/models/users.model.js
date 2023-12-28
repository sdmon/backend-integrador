const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

// Coleccion
const userCollection = 'Usuarios'

// Schema
const UsersSchema = Schema({
    first_name: {
        type: String,        
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        required: true
    },
    atCreated: {
        type: Date,
        default: Date()
    }    
    
})

// Model para acceder a la coleccion
UsersSchema.plugin(mongoosePaginate)
const usersModel = model(userCollection, UsersSchema)

module.exports = {
    usersModel
}