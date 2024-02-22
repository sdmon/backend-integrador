const { UserDao, ProductDao, TicketDao } = require("../daos/factory.js")
const { UserRepository } = require("./user.repository.js")
const { ProductRepository } = require("./product.repository.js")
const { TicketRepository } = require("./ticket.repository.js")


const usersService = new UserRepository(new UserDao())
const productsService = new ProductRepository(new ProductDao())
const ticketService = new TicketRepository(new TicketDao())



module.exports = {
    usersService,
    productsService,
    ticketService
}
