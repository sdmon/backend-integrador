const { ticketModel } = require("./models/ticket.model.js");

class TicketDaoMongo {
    constructor() {
        this.model = ticketModel;
    }

    async get() {
        try {
            return await this.model.find({});
        } catch (error) {
            console.log('Error al buscar tickets' + error);
        }
    }

    async getBy(filter) {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            console.log('Error al buscar el id del ticket' + error);
        }
    }    
    async generateTicketCode() {
        try {
          const pre = "TICKET"; 
          const timestamp = Date.now().toString(); 
          const random = Math.floor(Math.random() * 10000).toString(); 
      
          return `${pre}-${timestamp}-${random}`;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

    async create(ticket) {
        try {
            return await this.model.create(ticket);
        } catch (error) {
            console.log('Error en la creación de ticket' + error);
        }
    }

    async remove(tid) {
        try {
            const ticketDelete = await this.model.deleteOne({ _id: tid });
            return ticketDelete;
        } catch (error) {
            console.error('Error al eliminar el ticket', error);
        }
    }

    
}

module.exports = TicketDaoMongo;