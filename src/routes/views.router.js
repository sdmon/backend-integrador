const { Router } = require("express")
const router = Router()
const { usersModel } = require("../daos/Mongo/models/users.model.js")
const { prodModel } = require("../daos/Mongo/models/products.model.js")
const CartsDaoMongo = require("../daos/Mongo/cartsDaoMongo")


const cartsModel = new CartsDaoMongo()

router.get("/users", async (req, res) => {
  const { numPage = 1 } = req.query
  const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
    await usersModel.paginate({}, { limit: 10, page: numPage, lean: true })
  // console.log(result)
  res.render("users", {
    users: docs,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
    page,
  })
})

router.get("/products", async (req, res) => {
  const { cid } = req.query
  const { numPage = 1 } = req.query
  const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
    await prodModel.paginate({}, { limit: 10, page: numPage, lean: true })
  // console.log(result)
  res.render("products", {
    products: docs,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
    page,
    cid,
  })
})

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params

    const cartProducts = await cartsModel.getCartProducts(cid)

    res.render("cart", { cid, cartProducts })
  } catch (error) {
    console.error("Error al obtener el carrito:", error)
    res.status(500).send("Error al obtener el carrito")
  }
})
router.post("/carts/add", async (req, res) => {
  try {
    const { cid, pid, quantity = 1 } = req.body
    console.log(req.body)

    await cartsModel.addProdToCart(cid, pid, quantity)
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error)
    res.status(500).send("Error al agregar el producto al carrito")
  }
})

router.get("/", async (req, res) => {
  res.render("index", {
    username: "Seba",
  })
})

module.exports = router
