const {Schema, model} = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

// Coleccion
const userCollection = 'Usuarios'

// Schema
const UsersSchema = Schema({
    fullname: {
        type: String,
        required: true
    }
    ,
    first_name: {
        type: String,  
        index: true,      
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
    password:{
        type: String,
        required: true
    },    
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],    
        default: 'user',    
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