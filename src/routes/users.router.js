const { Router } = require("express")
const UserController = require('../controllers/users.controller.js')
const router = Router()

const {
  get,
  getBy,
  create,
  update,
  remove
} = new UserController()

router
  .get("/", get)
  .get("/:uid", getBy )
  .post("/", create )
  .put("/:uid", update)
  .delete("/uid", remove )

module.exports = router
