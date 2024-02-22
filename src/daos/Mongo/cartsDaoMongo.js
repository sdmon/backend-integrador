const { cartsModel } = require("./models/carts.model")
const { prodModel } = require("./models/products.model")


class CartDaoMongo {
  constructor() {
    this.model = cartsModel
    this.prodModel = prodModel
  }  

  async getCarts() {
    return await this.model.find()
  }
  async getCartById(cid) {
    try {
      const cart = await this.model
      .findOne({ _id: cid })
      .populate('products.productId')
      
      return cart
    } catch (error) {
      console.log(error)
    }
  }

  async createCart(newCart) {
    return await this.model.create({ products: [] })
  }

  async addProdToCart(cid, pid, quantity = 1) {
    try {
      let cart = await this.model.findOne({ _id: cid })

      if (!cart) {
        cart = await this.model.create({
          _id: cid,
          products: [{ productId: pid, quantity }],
        })
        return "Nuevo carrito creado"
      }

      if (!cart.state) {        
        return "El carrito no se puede modificar, ya fue comprado anteriormente";
      }

      let product = await this.prodModel.findOne({ _id: pid })

      if (!product) {
        throw new Error("No hay producto con esa id")
      }

      const index = cart.products.findIndex(
        (product) => product.productId.toString() === pid
      )

      if (index === -1) {
        cart.products.push({ productId: pid, quantity })
      } else {
        cart.products[index].quantity += quantity
      }

      await cart.save()

      return "Producto agregado al carrito"
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error)
    }
}

  async updateCart(cid, prods) {
    try {
      const updatedCart = await this.model.updateOne(
        { _id: cid },
        { $push: { products: prods } },
        { new: true }
      )

      return updatedCart
    } catch (error) {
      console.log(error)
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await this.model.updateOne(
        { _id: cid, "products.productId": pid },
        { $inc: { "products.$.quantity": quantity } }
      )

      return { success: "Producto actualizado con éxito!", payload: cart }
    } catch (error) {
      console.error(error)
    }
  }
  async getProductById(pid) {
    try {
      const product = await this.prodModel.findOne({ _id: pid })
      return product
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateProductStock(pid, newStock) {
    try {
      const updatedProduct = await this.prodModel.updateOne(
        { _id: pid },
        { $set: { stock: newStock } }
      )
      return updatedProduct
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateCartState(cid, newState) {
    try {
      const updatedCart = await this.model.updateOne(
        { _id: cid },
        { state: newState }
      )
      return updatedCart
    } catch (error) {
      console.error('Error al actualizar el estado del carrito:', error)
      throw error
    }
  }  


  async deleteCart(cid) {
    try {
        const deletedCart = await this.model.deleteOne({ _id: cid })

        if (deletedCart.deletedCount === 0) {
            console.log("No se encontró el carrito para eliminar")
            return null
        }

        return { success: "Carrito eliminado con éxito!" }
    } catch (error) {
        console.log(error)
        throw error
    }
}


  async deleteProduct(cid, pid) {
    try {
        const cart = await this.model.findOne({ _id: cid })

        if (!cart) {
            return "No se encuentra el producto a eliminar"
        }

        const updatedProducts = cart.products.filter((product) =>
            !product.productId.equals(pid)
        )

        cart.products = updatedProducts

        await cart.save()
        return cart
    } catch (error) {
        console.log(error)
        throw error 
    }
  }
}

module.exports = CartDaoMongo
