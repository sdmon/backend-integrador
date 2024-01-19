const { Router } = require("express")
const CartsDaoMongo = require("../daos/Mongo/cartsDaoMongo")
const router = Router()

const cartsService = new CartsDaoMongo()

router
  .get("/", async (req, res) => {
    try {
      const carts = await cartsService.getCarts()
      res.send({
        status: "Exito",
        payload: carts,
      })
    } catch (error) {
      console.error("Error", error)
      res.status(500).send({
        status: "Error",
        message: "Error del servidor",
      })
    }
  })
  .get("/:cid", async (req, res) => {
    try {
      const cartId = req.params.cid

      const cart = await cartsService.getCartById(cartId)
      if (!cart) {
        return res.status(400).send({
          status: "Error",
          message: "El carrito no existe",
        })
      }
      res.send({
        status: "Exito",
        payload: cart,
      })
    } catch (error) {
      console.error("Error", error)
      res.status(500).send({
        status: "Error",
        message: "Error al obtener carrito por id",
      })
    }
  })
  .post("/", async (req, res) => {
    try {
      const newCart = req.body

      const result = await cartsService.createCart(newCart)
      if (!result) {
        return res
          .status(400)
          .send({
            status: "Error",
            message: { error: "No se pudo agregar ningun producto" },
          })
      }
      res.send({
        status: "Exito",
        payload: result,
      })
    } catch (error) {
      console.error("Error al crear el carrito:", error)
      res.status(500).send({
        status: "Error",
        message: "Error del servidor",
      })
    }
  })
  .delete("/:cid", async (req, res) => {
    try {
      const { cid } = req.params
      const deletedCart = await cartsService.deleteCart(cid)
      res.send({
        status: "Exito",
        payload: deletedCart,
      })
    } catch (error) {
      console.error("Error al borrar el carrito:", error)
      res.status(500).send({
        status: "Error",
        message: "Error del servidor al borrar el carrito",
      })
    }
  })
  .delete("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params

      const deletedProduct = await cartsService.removeProductFromCart(cid, pid)

      console.log("Producto eliminado del carrito:", deletedProduct)

      res.send({
        status: "Exito",
        payload: deletedProduct,
      })
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error)
      res.status(500).send({
        status: "Error",
        message: "Error del servidor al eliminar el producto del carrito",
      })
    }
  })
  .put("/:cid", async (req, res) => {
    try {
      const { cid } = req.params
      const { products } = req.body

      const cart = await cartsService.getCartById(cid)
      if (!cart) {
        return res.status(400).send({
          status: "Error",
          message: "El carrito no existe",
        })
      }

      const update = await cartsService.updateCart(cid, products)
      res.send({
        status: "Exito",
        payload: update,
      })
    } catch (error) {
      console.error("Error al actualizar el carrito:", error)
      res.status(500).send({
        status: "Error",
        message: "Error del servidor al actualizar el carrito",
      })
    }
  })
  .put("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params
      const { quantity } = req.body

      const cart = await cartsService.getCartById(cid)

      if (!cart) {
        return res.status(400).send({
          status: "Error",
          message: "El carrito no existe",
        })
      }

      const update = await cartsService.updateProductQuantity(
        cid,
        pid,
        parseInt(quantity) || 1
      )

      res.send({
        status: "Exito",
        payload: update,
      })
    } catch (error) {
      console.error("Error al actualizar la cantidad ", error)
      res.status(500).send({
        status: "Error",
        message: "Error al actualizar la cantidad.",
      })
    }
  })
  

module.exports = router
