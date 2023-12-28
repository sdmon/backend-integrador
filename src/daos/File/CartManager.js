const fs = require("node:fs")

class CartManager {
  constructor() {
    this.path = "./src/mocks/Carts.json"
  }

  readFile = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  createCart = async () => {
    const carts = await this.readFile()
    if (carts.length === 0) {
      const cart = { id: 1, products: [] }
      carts.push(cart)
    } else {
      const cart = { id: carts.length + 1, products: [] }
      carts.push(cart)
    }
    return await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2),
      "utf-8"
    )
  }

  getCartById = async (cid) => {
    try {
      const carts = await this.readFile()
  
      if (!carts || carts.length === 0) {
        return "No hay carts"
      }
      const cart = carts.find((cart) => cart.id === cid)
  
      if (!cart) {
        return "No hay un cart con esa id"
      }
      return cart
    } catch (error) {
      return new Error(error)
    }
  }  
  getProduct = async (pid) => {    
    const products = await this.readFile()
    return products.some((p) => p.id === pid)
  }

  addProdToCart = async (cid, pid, quantity = 1) => {
    try {
      const carts = await this.readFile()
      const index = carts.findIndex((cart) => cart.id === cid)

      if (index === -1) {
        return "No hay carrito con esa id"
      }

      if (!(await this.getProduct(pid))) {
        return "El producto no existe"
      }

      if (!carts[index].products) {
        carts[index].products = []
      }

      const index2 = carts[index].products.findIndex((product) => product.productId === pid)

      if (index2 === -1) {
        carts[index].products.push({ productId: pid, quantity })
      } else {
        carts[index].products[index2].quantity += quantity
      }

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, 2),
        "utf-8"
      )

      return "Producto agregado al carrito"
    } catch (error) {
      return new Error(error)
    }
  }

  deleteCart = async (cid) => {
    try {
      const carts = await this.readFile()
      const index = carts.findIndex((cart) => cart.id === cid)

      if (index !== -1) {
        carts.splice(index, 1)
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(carts, null, 2),
          "utf-8"
        )
        return "Carrito eliminado"
      } else {
        return "No hay un carrito con esa id"
      }
    } catch (error) {
        return new Error(error)
    }
  }  
}

module.exports = CartManager
