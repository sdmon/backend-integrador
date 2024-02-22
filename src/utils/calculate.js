function calculate(products) {
  try {
    let total = 0;

    for (const product of products) {
      const price = Number(product.productId.price);
      const quantity = Number(product.quantity);

      if (!isNaN(price) && !isNaN(quantity)) {
        total += price * quantity;
      }
    }

    return total;
  } catch (error) {
    console.error('Error al calcular el monto total:', error);
    throw error;
  }
}

module.exports = {
  calculate,
};