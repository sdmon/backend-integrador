const { Router } = require("express")
const ProductController = require('../controllers/products.controller.js')
const router = Router()

const {
  get,
  getBy,
  getModel,
  create,
  update,
  remove
} = new ProductController()


router
  .get("/", get ) 
router
  .get("/",  getModel)
  .get("/:pid",  getBy)
  .post("/",  create)
  .put("/:pid",  update)
  .delete("/:pid",  remove)

module.exports = router
