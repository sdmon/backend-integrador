
class ProductDto {
    constructor(newProduct){
        this.title = newProduct.title
        this.description = newProduct.description
        this.price = newProduct.price
        this.thumbnail = newProduct.thumbnail
        this.code = newProduct.code
        this.status = newProduct.status
        this.stock = newProduct.stock        
    }
}

module.exports = {
    ProductDto
}