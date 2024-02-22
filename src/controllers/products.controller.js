const { prodModel } = require("../daos/Mongo/models/products.model")
const { authorizationJWT } = require("../middlewares/jwtPassport.middleware.js")
const { productsService } = require("../repositories/service.js")
const { passportCall } = require("../utils/passportCall.js")


class ProductController {
    constructor(){
        this.productsService = productsService    
    }
    get = async (req, res) => {
        try {
          const products = await this.productsService.get()
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
      }
    getModel = async (req, res) => {
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
      }
    getBy = async (req, res) => {
        try {
          const { pid } = req.params
          // const filter = req.query
          const product = await this.productsService.getBy({_id: pid})

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
    }
    create = async (req, res) => {
      try {
        const { title, description, price, thumbnail, code, status, stock } = req.body
    
        if (!title || !description || !price || !thumbnail || !code || !status || !stock) {
          return res.status(400).json({ error: "Todos los campos son requeridos." })
        }
    
        const jwtMiddleware = passportCall("jwt")
        const authorization = authorizationJWT(["admin"])
    
        jwtMiddleware(req, res, async (err) => {
          if (err) {
            return res.status(401).json({ error: 'No autorizado' })
          }
    
          authorization(req, res, async (err) => {
            if (err) {
              return res.status(403).json({ error: 'Usuario sin permiso' })
            }
    
            try {
              const newProduct = { title, description, price, thumbnail, code, status, stock }
              const created = await this.productsService.create(newProduct)
    
              res.status(201).send({
                status: "Exito!",
                payload: created,
              })
            } catch (error) {
              console.log(error)
              res.status(500).send({
                status: "Error",
                message: "Error de servidor",
              })
            }
          })
        })
      } catch (error) {
        console.log(error)
        res.status(500).send({
          status: "Error",
          message: "Error de servidor",
        })
      }
    }

    update = async (req, res) => {
      try {
        const { pid } = req.params
        const data = req.body
    
        const jwtMiddleware = passportCall("jwt")
        const authorization = authorizationJWT(["admin"])
    
        jwtMiddleware(req, res, async (err) => {
          if (err) {
            return res.status(401).json({ error: 'No autorizado' })
          }
    
          authorization(req, res, async (err) => {
            if (err) {
              return res.status(403).json({ error: 'Usuario sin permiso' })
            }
    
            const updatedProduct = await this.productsService.update({ _id: pid }, data)
    
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
          })
        })
      } catch (error) {
        console.log(error)
        res.status(500).send({
          status: "Error",
          message: "Error de servidor",
        })
      }
    }
    remove = async (req, res) => {
      try {
        const { pid } = req.params
    
        const jwtMiddleware = passportCall("jwt")
        const authorization = authorizationJWT(["admin"])
    
        jwtMiddleware(req, res, async (err) => {
          if (err) {
            return res.status(401).json({ error: 'No autorizado' })
          }
    
          authorization(req, res, async (err) => {
            if (err) {
              return res.status(403).json({ error: 'Usuario sin permiso' })
            }
    
            try {
              const result = await this.productsService.remove({ _id: pid })
    
              if (result.deletedCount === 0) {
                return res.status(404).send({
                  status: "Error",
                  message: "Producto no encontrado",
                })
              }
    
              res.send({
                status: "Exito!",
                message: "Producto eliminado!",
              })
            } catch (error) {
              console.log(error)
              res.status(500).send({
                status: "Error",
                message: "Error de servidor",
              })
            }
          })
        })
      } catch (error) {
        console.log(error)
        res.status(500).send({
          status: "Error",
          message: "Error de servidor",
        })
      }
    }
}

module.exports = ProductController