const { Schema, model } = require('mongoose')

const cartCollection = 'Carritos'
const { prodModel } = require('./products.model')

const CartSchema = Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: prodModel, 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  state: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

CartSchema.pre(['findOneAndUpdate', 'update'], function () {
  this.populate('products.productId');
});

const cartsModel = model(cartCollection, CartSchema);

module.exports = {
  cartsModel,
};

module.exports = {
  cartsModel,
}