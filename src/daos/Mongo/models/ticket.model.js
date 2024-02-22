const { Schema, model } = require('mongoose')

const ticketCollection = 'Tickets'
const { cartsModel } = require('./carts.model.js')
const { usersModel } = require('./users.model.js')

const TicketSchema = Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: Schema.Types.ObjectId,
    ref: usersModel,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: cartsModel,
    required: true,
  },
})

const ticketModel = model(ticketCollection, TicketSchema)

module.exports = {
  ticketModel,
}