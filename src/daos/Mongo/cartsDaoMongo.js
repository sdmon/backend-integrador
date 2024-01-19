const { cartsModel } = require("./models/carts.model")
const { prodModel } = require("./models/products.model")
const mongoose = require('mongoose')

class CartDaoMongo {
  constructor() {
      this.model = cartsModel
  }

  validateId(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Formato invalido')
    }
  } 

  async getCarts() {
      return await this.model.find().lean()
  }
  async getCartById(cid) {
    try {
        if (!cid || typeof cid !== 'string' || !mongoose.Types.ObjectId.isValid(cid)) {
            return 'Invalid cart ID'
        }

        const cart = await this.model.findById(cid)
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
      this.validateId(pid)     
      this.validateId(cid) 

      let cart = await this.model.findById(cid)

      if (!cart) {
        cart = await this.model.create({ _id: cid, products: [{ pid: pid, quantity }] })
        return 'Nuevo carrito creado'
      }

      const product = await this.getProduct(pid)

      if (!product) {
        throw new Error('No hay producto con esa id')
      }

      const index = cart.products.findIndex(
        (product) => product.pid.toString() === pid
      )  

      if (index === -1) {
        cart.products.push({ pid: pid, quantity })
      } else {
        cart.products[index].quantity += quantity
      }

      await cart.save()      

      return 'Producto agregado al carrito'
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error)      
    }
  }

  async updateCart(cid, prods) {
      try {

          const updatedCart = await this.model.updateOne(
              { _id: cid },
              { $push :{products: prods} },
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
              {_id:cid,"products._id":pid},
              {$inc:{"products.$.quantity":quantity}}
          )
          return {success:'Producto actualizado con exito!', payload:cart}
      } catch (error) {
          console.error(error)
      }
  }

  deleteCart = async (cid) => {
      try {
          
          const cart = await this.model.findOne({ _id: cid })

        if (!cart){
          console.log('no se encontro el carrito')
        }
  
  
        cart.products = []
  
        const updatedCart = await cart.save()
  
        return updatedCart

      } catch (error) {
        console.log(error) 
      }
    }
  
  async deleteProduct(cid, pid) {
      try {

          const cart = await this.model.findOne({ _id: cid })

          if (!cart) {
              return 'No se encuentra el producto a eliminar'
          }

          const productIndex = cart.products.findIndex(product => product._id.equals(pid))

          if (productIndex !== -1) {
              cart.products.splice(productIndex, 1)
          }


          await cart.save()
          return cart

      } catch (error) {
          console.log(error)
      }
  }

}

module.exports = CartDaoMongo


