const { Router } = require("express");
const CartsDaoMongo = require("../daos/Mongo/cartsDaoMongo.js");
const TicketDaoMongo = require("../daos/Mongo/ticketDaoMongo.js");
const { ticketService } = require("../repositories/service.js");
const { passportCall } = require("../utils/passportCall.js");
const { calculate } = require("../utils/calculate.js");

const router = Router();

const cartsService = new CartsDaoMongo();
const ticketsService = new TicketDaoMongo();

router
  .get("/", async (req, res) => {
    try {
      const carts = await cartsService.getCarts();
      res.send({
        status: "Exito",
        payload: carts,
      });
    } catch (error) {
      console.error("Error", error);
      res.status(500).send({
        status: "Error",
        message: "Error del servidor",
      });
    }
  })
  .get("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;

      const cart = await cartsService.getCartById(cid);
      if (!cart) {
        return res.status(400).send({
          status: "Error",
          message: "El carrito no existe",
        });
      }
      res.send({
        status: "Exito",
        payload: cart,
      });
    } catch (error) {
      console.error("Error", error);
      res.status(500).send({
        status: "Error",
        message: "Error al obtener carrito por id",
      });
    }
  })
  .post("/", async (req, res) => {
    try {
      const newCart = req.body;

      const result = await cartsService.createCart(newCart);
      if (!result) {
        return res.status(400).send({
          status: "Error",
          message: { error: "No se pudo agregar ningun producto" },
        });
      }
      res.send({
        status: "Exito",
        payload: result,
      });
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res.status(500).send({
        status: "Error",
        message: "Error del servidor",
      });
    }
  })
  .post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      const result = await cartsService.addProdToCart(cid, pid, quantity);

      res.status(200).json({ message: result });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

  .delete("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const deletedCart = await cartsService.deleteCart(cid);
      res.send({
        status: "Exito",
        payload: deletedCart,
      });
    } catch (error) {
      console.error("Error al borrar el carrito:", error);
      res.status(500).send({
        status: "Error",
        message: "Error del servidor al borrar el carrito",
      });
    }
  })
  .delete("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;

      const deletedProduct = await cartsService.deleteProduct(cid, pid);

      console.log("Producto eliminado del carrito:", deletedProduct);

      res.send({
        status: "Exito",
        payload: deletedProduct,
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      res.status(500).send({
        status: "Error",
        message: "Error del servidor al eliminar el producto del carrito",
      });
    }
  })
  .put("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;

      const cart = await cartsService.getCartById(cid);
      if (!cart) {
        return res.status(400).send({
          status: "Error",
          message: "El carrito no existe",
        });
      }

      const update = await cartsService.updateCart(cid, products);
      res.send({
        status: "Exito",
        payload: update,
      });
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).send({
        status: "Error",
        message: "Error del servidor al actualizar el carrito",
      });
    }
  })
  .put("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const update = await cartsService.updateProductQuantity(
        cid,
        pid,
        quantity
      );

      res.send({
        status: "Exito",
        payload: update,
      });
    } catch (error) {
      console.error("Error al actualizar la cantidad ", error);
      res.status(500).send({
        status: "Error",
        message: "Error al actualizar la cantidad.",
      });
    }
  })
  .post("/:cid/purchase", passportCall("jwt"), async (req, res) => {
    const { cid } = req.params;

    try {
      const cart = await cartsService.getCartById(cid);

      if (!cart) {
        return res.status(400).send({
          status: "Error",
          message: "El carrito no existe",
        });
      }

      if (!cart.state) {
        return res.status(400).send({
          status: "Error",
          message: "El carrito ya fue comprado anteriormente",
        });
      }

      for (const product of cart.products) {

        const quantity = Number(product.quantity);
        
        const productDetails = await cartsService.getProductById(
          product.productId
        );

        if (!productDetails || productDetails.stock < product.quantity) {
          const productName = productDetails
            ? productDetails.title
            : "Desconocido";

          return res.status(400).send({
            status: "Error",
            message: `No hay suficiente stock para el producto: ${productName}`,
          });
        }

        await cartsService.updateProductStock(
          product.productId,
          productDetails.stock - quantity
        );
      }

      const purchaserId = req?.user?._id || req.user.id;
      const total = await calculate(cart.products);

      const ticket = {
        code: await ticketsService.generateTicketCode(),
        amount: total,
        purchaser: purchaserId,
        cart: cart._id,
      };

      await ticketService.create(ticket);

      await cartsService.updateCartState(cart._id, false);

      res.send({
        status: "Exito",
        message: "Compra finalizada con exito!",
        ticket: {
          code: ticket.code,
          amount: ticket.amount,
        },
      });
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      res.status(500).send({
        status: "Error",
        message: "Error del servidor al finalizar la compra",
      });
    }
  });

module.exports = router;
