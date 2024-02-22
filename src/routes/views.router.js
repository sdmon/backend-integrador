const { Router } = require("express")
const router = Router()
const { usersModel } = require("../daos/Mongo/models/users.model.js")
const { prodModel } = require("../daos/Mongo/models/products.model.js")
const CartsDaoMongo = require("../daos/Mongo/cartsDaoMongo")
const { authentication } = require("../middlewares/auth.middleware.js")


const cartsModel = new CartsDaoMongo()

router.get('/register', async (req, res) => {
  res.render('register')
})

router.get('/login', async (req, res) => {
  res.render('login')
})

router.get("/users", authentication, async (req, res) => {
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
  
  res.render("products", {
    products: docs,
    first_name: req.session.user.first_name,
    role: req.session.user.role,    
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

    await cartsModel.addProdToCart(cid, pid, quantity)
    res.redirect(`/carts/${cid}`)
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
