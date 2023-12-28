const { Router } = require("express")
const { ordersModel } = require("../daos/Mongo/models/orders.model")
const router = Router()

router
  .get("/", async (req, res) => {
    try {
      const orders = await ordersModel.aggregate([
        // Matcheo la busqueda por tamanio
        {$match: {size: "medium"}},
        // Agrupo por nombre y la suma de cantidad total
        {$group: { _id: "$name", totalQuantity: { $sum: "$quantity"}}},
        // Ordeno por cantidad descendente y nombre ascendente
        {$sort: {totalQuantity: -1, _id: 1}},
        // Vuelvo a agrupar por nombre y pusheo todas las propiedades para crear un array nuevo
        {$group: {_id: 1, orders:{ $push: "$$ROOT"}}},
        //Creamos nuevo documento para guardar esta busqueda
        //{$project: { "_id": 0, orders: "$orders"}},
        //{$merge: {into: "reports"}}         
      ])
      res.status(201).json({
        message: "Exito!",
        payload: orders,
      })
      console.log(orders)
    } catch (error) {
      console.log(error)
    }
  })
  .post("/", async (req, res) => {})
  .put("/", async (req, res) => {})
  .delete("/", async (req, res) => {})

module.exports = router
