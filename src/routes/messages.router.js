const { Router } = require("express")
const messagesDaoMongo = require("../daos/Mongo/messagesDaoMongo")
const router = Router()

const messagesService = new messagesDaoMongo()

router
  .get("/", async (req, res) => {
    try {
      const messages = await messagesService.getMessages()
      res.status(200).json({
        status: "Exito!",
        payload: messages,
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      })
    }
  })  

module.exports = router