const { connect } = require("mongoose")
const { ordersModel } = require("../daos/Mongo/models/orders.model")

exports.connectDb = async () => {
  try {
    await connect(
      "mongodb+srv://dmsebastian:z4KUCCax9cUWGgg8@cluster0.vy207vv.mongodb.net/backend-sdm?retryWrites=true&w=majority"
    )
    console.log("Base de datos conectada con exito!")
    /*let result = await ordersModel.insertMany([
      {
        name: "Napolitana",
        size: "small",
        price: 20,
        quantity: 5,
        date: Date(),
      },
      {
        name: "Napolitana",
        size: "medium",
        price: 30,
        quantity: 10,
        date: Date(),
      },
      {
        name: "Napolitana",
        size: "large",
        price: 40,
        quantity: 8,
        date: Date(),
      },
      {
        name: "Calabresa",
        size: "small",
        price: 15,
        quantity: 5,
        date: Date(),
      },
      {
        name: "Calabresa",
        size: "medium",
        price: 25,
        quantity: 15,
        date: Date(),
      },
      {
        name: "Calabresa",
        size: "large",
        price: 30,
        quantity: 12,
        date: Date(),
      },
      {
        name: "Jamon y morrones",
        size: "small",
        price: 12,
        quantity: 5,
        date: Date(),
      },
      {
        name: "Jamon y morrones",
        size: "medium",
        price: 18,
        quantity: 10,
        date: Date(),
      },
      {
        name: "Jamon y morrones",
        size: "large",
        price: 24,
        quantity: 15,
        date: Date(),
      },
      {
        name: "Rucula y queso",
        size: "medium",
        price: 20,
        quantity: 5,
        date: Date(),
      },
    ])*/
  } catch (error) {
    console.log(error)
  }
}
