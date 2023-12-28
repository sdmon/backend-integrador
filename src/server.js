const express = require("express")
const appRouter = require("./routes")
const { connectDb } = require("./config")
const handlebars = require("express-handlebars")
const { Server } = require('socket.io')
const MessagesDaoMongo = require("./daos/Mongo/messagesDaoMongo.js")

const app = express()
const PORT = 8080

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.use(appRouter)

app.get("/", async (req, res) => {
  await res.send("Servidor ok!")
})

app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send("Error de servidor")
})

const serverHttp = app.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log(`Escuchando en el puerto ${PORT}`)
})

const io = new Server(serverHttp)
const messagesService = new MessagesDaoMongo()

let messagesArray = []

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!")
  
  messagesService
    .getMessages()
    .then((messages) => {
      messagesArray = messages
      io.emit("messageLogs", messagesArray)
    })
    .catch((error) => {
      console.error("Error al guardar mensajes: ", error)
    })

  socket.on("message", (data) => {
    messagesService
      .createMessage(data)
      .then((createdMessage) => {
        messagesArray.push(createdMessage)

        io.emit("messageLogs", messagesArray)
      })
      .catch((error) => {
        console.error("Error al guardar el mensaje: ", error)
      })
  })
})
