const { Schema, model } = require("mongoose")

const messageCollection = 'Mensajes'

const MessagesSchema = Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const messagesModel = model(messageCollection, MessagesSchema)

module.exports = {
  messagesModel
}