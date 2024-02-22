const { Router } = require("express")
const TicketController = require('../controllers/tickets.controller.js')
const router = Router()

const {
  get,
  getBy,
  create,
  remove
} = new TicketController()

router
  .get("/", get)
  .get("/:tid", getBy )
  .post("/", create )  
  .delete("/:tid", remove )

module.exports = router