const { connect } = require('mongoose')

class MongoSingleton {
    static instance
    constructor(url){
        connect(url)
    }

    static getInstance(url) {
        if(this.instance){
            console.log('Base de datos existente!')
            return this.instance
        }
        this.instance = new MongoSingleton(url)
        console.log('Conectado a la base de datos!')
    }
}

module.exports = {
    MongoSingleton
}