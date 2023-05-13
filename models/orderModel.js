const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = new mongoose.Schema({
   shippingInfo: {
      address: { type: String, required: [true, 'Address required!'] },
      city: { type: String, trim: true, required: [true, 'city required!'] },
      state: { type: String, trim: true, required: [true, 'state required!'] },
      pincode: { type: Number, trim: true, required: [true, 'picode required!'] },
      phone: { type: Number, trim: true, required: [true, 'Phone required!'] },
   },
   orderItem: [
      {
         name: {
            type: String,
            trim: true,
            required: [true, 'Order Item name required! '],
         },
         price: {
            type: Number,
            required: true,
         },
         quantity: {
            type: Number,
            required: true,
         },
         image: {
            type: String,
            required: true,
         },
         product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true,
         },
      },
   ],
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
   },

   paymentInfo: {
      id: {
         type: String,
         required: true,
      },
      status: {
         type: String,
         required: true,
      },
   },
   paidAt: {
      type: Date,
      required: true,
   },
   totalPrice: {
      type: Number,
      required: true,
      default: 0,
   },
   orderStatus: {
      type: String,
      required: true,
      default: 'Processing',
   },
   deliveredAt: Date,
   shippedAt: Date,
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.Model('Order', orderSchema);
