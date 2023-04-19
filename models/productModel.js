const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Product must have a name!'],
      trim: true,
      unique: true,
      maxLength: [50, 'A product name must have less or equal then 40 characters!'],
      minlength: [10, 'A product name must have more or equal then 10 characters!'],
   },
   slug: String,
   stock: {
      type: Number,
      required: [true, 'A product must have a stock value!'],
      min: [1, 'Product stock cannot be negative!'],
      max: [10, 'Product stock cannot exeed limits(10 products)!'],
      default: 1,
   },
   price: {
      type: Number,
      required: [true, 'A product must have a price!'],
   },
   priceDiscount: {
      type: Number,
      validate: {
         validator: function (val) {
            // this only points to current doc on NEW document creation
            return val < this.price;
         },
         message: 'Discount price ({VALUE}) should be below regular price!',
      },
   },
   description: {
      type: String,
      trim: true,
      required: [true, 'A product must have a description!'],
   },
   specification: [
      {
         title: {
            type: String,
            required: true,
         },
         description: {
            type: String,
            required: true,
         },
      },
   ],
   brand: {
      name: {
         type: String,
         required: [true, 'A product must have a brand name!'],
      },
      logo: {
         public_id: {
            type: String,
            required: true,
         },
         public_url: {
            type: String,
            required: true,
         },
      },
   },
   images: {
      public_id: {
         type: String,
         required: true,
      },
      public_url: {
         type: String,
         required: true,
      },
   },
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please enter user type, e.g user or vendor!'],
   },
   reviews: [
      {
         user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
         },
         name: {
            type: String,
            required: true,
         },
         rating: {
            type: Number,
            required: true,
         },
         comment: {
            type: String,
            required: true,
         },
      },
   ],
   createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
   },
   isActive: {
      type: Boolean,
      default: true,
   },
});

// schema

productSchema.pre('save', async function (next) {
   this.slug = `${this.name}`.split(' ').join('-').toLowerCase();
   next();
});

module.exports = mongoose.model('Product', productSchema);
