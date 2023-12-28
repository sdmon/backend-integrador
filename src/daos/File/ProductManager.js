const fs = require("node:fs")

const path = "./src/mocks/Productos.json"

class ProductManager {
  constructor() {
    this.path = path
  }

  readFile = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      return []
    }
  }

  getProducts = async () => {
    try {
      return await this.readFile()
    } catch (error) {
      return "Aun no hay productos"
    }
  }

  getProduct = async (id) => {
    try {
      const products = await this.readFile()
  
      if (!products || products.length === 0) {
        return "No hay productos"
      } 
      const product = products.find((product) => {        
        return String(product.id) === String(id)
      })
  
      if (!product) {
        return "No hay un producto con esa id"
      }
      
      return product
    } catch (error) {
      return new Error(error)
    }
  }

  addProduct = async (newProduct) => {
    try {
      
      let products = await this.readFile()
      
      const prod = products.find((item) => item.code === newProduct.code)
      if (prod) {
        return `El producto existe`
      }

      if (products.length === 0) {
        // Si no hay un producto arranca el id de 1
        newProduct.id = 1
        products.push(newProduct)
      } else {
        // Si el array ya tiene objetos le sumo uno al total del array y lo guardo como id del producto
        products = [
          ...products,
          {
            ...newProduct,
            id: String(
              products.length > 0
                ? Number(products[products.length - 1].id) + 1
                : 1
            ),
          },
        ]
      }
      // Si no existe el archivo se crea y lo escribimos en JSON
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, 2),
        "utf-8"
      )

      return "Producto agregado"
    } catch (error) {
      return new Error(error)
    }
  }

  async update(pid, updateProduct) {
    try {
      let products = await this.readFile()

      const index = products.findIndex((product) => product.id === pid)
      if (index !== -1) {
        updateProduct.id = pid
        products[index] = updateProduct

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, 2),
          "utf-8"
        )

        return "Producto actualizado"
      } else {
        return null
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  deleteProduct = async (id) => {
    try {
      let products = await this.readFile()
      // Busco el index
      const index = products.findIndex((product) => product.id === id)
      // Si es distinto a -1 lo borro
      if (index !== -1) {
        products.splice(index, 1)
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, 2),
          "utf-8"
        )
        return "Producto eliminado"
      } else {        
        return null
      }
    } catch (error) {
      return new Error(error)
    }
  }
}

module.exports = ProductManager