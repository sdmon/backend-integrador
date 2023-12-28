const { cartsModel } = require('./models/carts.model')
const { prodModel } = require('./models/products.model') 
class CartsDaoMongo {
  constructor() {
    this.model = cartsModel
  }

  validateId(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Formato invalido');
    }
  }

  async getCarts() {
    try {
      return await this.model.find({})
    } catch (error) {
      console.error('Error al traer todos carritos: ', error)
    }
  }

  async getCartById(cid) {
    try {
      this.validateId(cid)
      return await this.model.findById(cid)
    } catch (error) {
      console.error('Error al obtener carrito por id:', error)      
    }
  }

  async getProduct(pid) {
    try {
      this.validateId(pid)
      const product = await prodModel.findById(pid)  
      return product
    } catch (error) {
      console.error('Error al obtener producto por id:', error)      
    }
  }
  async createCart() {
    try {
      const cart = await this.model.create({ products: [] })
      return cart
    } catch (error) {
      console.error('Error al crear carrito:', error)
      throw new Error('Error al crear carrito')
    }
  }

  async addProdToCart(cid, pid, quantity = 1) {
    try {      
      this.validateId(pid)     
      this.validateId(cid) 

      let cart = await this.model.findById(cid)

      if (!cart) {
        cart = await this.model.create({ _id: cid, products: [{ productId: pid, quantity }] })
        return 'Nuevo carrito creado'
      }

      const product = await this.getProduct(pid)

      if (!product) {
        throw new Error('No hay producto con esa id')
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

      return 'Producto agregado al carrito'
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error)      
    }
  }
  async getCartProducts(cid) {
    try {
      this.validateId(cid)
      const cart = await this.model.findById(cid)

      if (!cart) {
        throw new Error('No hay carrito con esa id')
      }

      const ids = cart.products.map(product => product.productId)
      const cartProducts = await prodModel.find({ _id: { $in: ids } })

      return cartProducts
    } catch (error) {
      console.error('Error al obtener productos del carrito:', error)
    }
  }

  async updateCart(cid, cartReplace) {
    try {
      this.validateId(cid)

      const updatedCart = await this.model.updateOne({ _id: cid }, cartReplace)

      if (updatedCart.nModified === 0) {
        console.log('No existe ese carrito!')
      }
      return updatedCart
    } catch (error) {
      console.error('Error al actualizar carrito:', error)      
    }
  }

  async deleteCart(cid) {
    try {
      this.validateId(cid)

      const deletedCart = await this.model.findByIdAndDelete(cid)

      if (!deletedCart) {
        throw new Error('Carrito no encontrado!')
      }
      return deletedCart
    } catch (error) {
      console.error('Error al borrar el carrito! ', error)      
    }
  }
  async removeProductFromCart(cid, pid) {
    try {
      this.validateId(cid)
      this.validateId(pid)

      const cart = await this.model.findById(cid)

      if (!cart) {
        throw new Error('No hay carrito con esa id')
      }

      const updatedProducts = cart.products.filter(
        (product) => product.productId.toString() !== pid
      )

      cart.products = updatedProducts

      await cart.save()

      return 'Producto eliminado'
      
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error)      
    }
  }
  async updateProductQuantity(cid, pid, updquantity) {
    try {
      this.validateId(cid)
      this.validateId(pid)

      const cart = await this.model.findById(cid)

      if (!cart) {
        console.log("No existe ese carrito")
      }

      const index = cart.products.findIndex(
        (product) => product.productId.toString() === pid
      )

      if (index === -1) {
        console.log("No existe ese producto")
      }

      cart.products[index].quantity = updquantity

      await cart.save()

      return 'Producto actualizado'

    } catch (error) {
      console.error('Error al actualizar:', error)      
    }
  }
}

module.exports = CartsDaoMongo