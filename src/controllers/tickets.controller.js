const { ticketService } = require("../repositories/service.js");

class TicketController {
  constructor() {
    this.ticketService = ticketService;
  }
  get = async (req, res) => {
    try {
      const tickets = await this.ticketService.get();
      res.send({
        status: "Exito!",
        payload: tickets,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      });
    }
  };

  getBy = async (req, res) => {
    try {
      const { tid } = req.params;
      // const filter = req.query
      const ticket = await this.ticketService.getBy({ _id: tid });

      if (!ticket) {
        return res.status(404).send({
          status: "Error",
          message: "Ticket no encontrado",
        });
      }
      res.send({
        status: "Exito!",
        payload: ticket,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      });
    }
  };
  create = async (user, req, res) => {
    try {
      const { code, purchase_datetime, amount, purchaser, cart } = req.body;

      if (!code || !purchase_datetime || !amount || !purchaser || !cart) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos." });
      }

      const newTicket = {
        code,
        purchase_datetime,
        amount,
        purchaser: user._id,
        cart,
      };
      const created = await this.ticketService.create(newTicket);

      res.status(201).send({
        status: "Exito!",
        payload: created,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      });
    }
  };

  remove = async (req, res) => {
    try {
      const { tid } = req.params;

      const result = await this.ticketService.remove({ _id: tid });

      if (result.deletedCount === 0) {
        return res.status(404).send({
          status: "Error",
          message: "Ticket no encontrado",
        });
      }
      res.send({
        status: "Exito!",
        message: "Ticket eliminado!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "Error",
        message: "Error de servidor",
      });
    }
  };
}

module.exports = TicketController;
