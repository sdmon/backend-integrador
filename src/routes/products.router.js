const { Router } = require("express")
const ProductDaoMongo = require("../daos/Mongo/productsDaoMongo")
const router = Router()
const { prodModel } = require("../daos/Mongo/models/products.model")

const productsService = new ProductDaoMongo()

/* router
  .get("/", async (req, res) => {
    try {
      const products = await productsService.getProducts()
      res.send({
        status: "Exito!",
        payload: products,
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      })
    }
  }) */
router
  .get("/", async (req, res) => {
    try {      
      const { numPage = 1 } = req.query
      const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
        await prodModel.paginate(
          {},
          { limit: 10, page: numPage, lean: true }
        )
      res.send({
        status: "Exito!",
        payload: docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, page
      })
    } catch (error) {
      console.error("Error:", error)
      res.status(500).send({ status: "Error", message: "Internal Server Error" })
    }
  })
  .get("/:pid", async (req, res) => {
    try {
      const { pid } = req.params
      const product = await productsService.getProductById(pid)
      if (!product) {
        return res.status(404).send({
          status: "Error",
          message: "Producto no encontrado",
        })
      }
      res.send({
        status: "Exito!",
        payload: product,
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      })
    }
  })
  .post("/", async (req, res) => {
    try {
      const { title, description, price, thumbnail, code, status, stock } =
        req.body
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !status ||
        !stock
      ) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos." })
      }
      console.log(title, description, price, thumbnail, code, status, stock)
      const productCreate = await productsService.createProduct({
        title,
        description,
        price,
        thumbnail,
        code,
        status,
        stock,
      })
      res.status(201).send({
        status: "Exito!",
        payload: productCreate,
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      })
    }
  })
  .put("/:pid", async (req, res) => {
    try {
      const { pid } = req.params
      const data = req.body
      const updatedProduct = await productsService.updateProduct(pid, data)
      if (updatedProduct.n === 0) {
        return res.status(404).send({
          status: "Error",
          message: "Producto no encontrado",
        })
      }
      res.send({
        status: "Exito!",
        message: "Producto actualizado",
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      })
    }
  })
  .delete("/:pid", async (req, res) => {
    try {
      const { pid } = req.params
      const result = await productsService.deleteProduct(pid)
      if (result.deletedCount === 0) {
        return res.status(404).send({
          status: "Error",
          message: "Producto no encontrado",
        })
      }
      res.send({
        status: "Exito!",
        message: "Product eliminado!",
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
