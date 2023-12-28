const { messagesModel } = require("./models/messages.model.js")

class MessagesDaoMongo {
  constructor() {
    this.model = messagesModel
  }

  async getMessages() {
    try {
      return await this.model.find({})
    } catch (error) {
      console.log(error)
    }
  }

  async createMessage(message) {
    try {
      return await this.model.create(message)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = MessagesDaoMongo