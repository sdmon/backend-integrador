const { TicketDto } = require("../DTO/ticketDto.js")
const { TicketDao } = require("../daos/factory.js")

class TicketRepository {
    constructor(){
        this.dao = new TicketDao()
    }

        get = async () => await this.dao.get()
        getBy = async (filter) => await this.dao.getBy(filter)
        create = async (newTicket) => {
            const newTicketDto = new TicketDto(newTicket)
            return await this.dao.create(newTicketDto)
        }     
        remove = async (tid) => this.dao.remove(tid)    
}

module.exports = {
    TicketRepository
}