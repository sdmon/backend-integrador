const { configObject: {persistence} } = require('../config/index.js')

let UserDao
let ProductDao 
let TicketDao

switch (persistence) {
    case 'MONGO':
        const UserDaoMongo = require('./Mongo/usersDaoMongo.js')
        UserDao = UserDaoMongo

        const ProductDaoMongo = require('./Mongo/productsDaoMongo.js')
        ProductDao = ProductDaoMongo         
        
        const TicketDaoMongo = require('./Mongo/ticketDaoMongo.js')
        TicketDao = TicketDaoMongo
        break; 

    case 'FILE':
        const UserDaoFile = require('./File/UserManager.js')
        UserDao = UserDaoFile

        const ProductDaoFile = require('./File/ProductManager.js')
        ProductDao = ProductDaoFile
        break;
    default: 
        const pdm = require('./Mongo/productsDaoMongo.js')
        ProductDao = pdm
    break;
}

module.exports = {
    UserDao,
    ProductDao,
    TicketDao
}