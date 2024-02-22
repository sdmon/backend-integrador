
class TicketDto {
    constructor(newTicket){
        this.code = newTicket.code        
        this.purchase_datetime = newTicket.purchase_datetime
        this.amount = newTicket.amount
        this.purchaser = newTicket.purchaser  
        this.cart = newTicket.cart                       
    }
}

module.exports = {
    TicketDto
}