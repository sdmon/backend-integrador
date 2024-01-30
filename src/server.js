const express = require("express")
const appRouter = require("./routes")

const { connectDb } = require("./config")
const handlebars = require("express-handlebars")
const { Server } = require('socket.io')

const sessionRouter = require('./routes/sessions.router.js')
const MessagesDaoMongo = require("./daos/Mongo/messagesDaoMongo.js"
)
const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')
const MongoStore = require('connect-mongo')

const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')


const app = express()
const PORT = 8080

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser('secr3tw0rd'))

// fileStore para session local
// const fileStore = new FileStore(session)

//Session mongo
/*app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://dmsebastian:z4KUCCax9cUWGgg8@cluster0.vy207vv.mongodb.net/backend-sdm?retryWrites=true&w=majority',
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,      
    },
    ttl: 15,
  }),
  secret: 'secret0',
  resave: true,
  saveUninitialized: true
})) */

// Session local
/* app.use(session({
  store: new fileStore({
    path: './src/sessions',
    ttl: 100,
    retire: 0}),
  secret: 'secret0',
  resave: true,
  saveUninitialized: true
})) */ 

initializePassport()

app.use(session({
  secret: 'secr3tw0rd',
  resave: true,
  saveUninitialized: true
})) 
app.use(passport.initialize())

// Session para la estrategia 2
//app.use(passport.session())


app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")
app.use('/api/sessions', sessionRouter) 

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
