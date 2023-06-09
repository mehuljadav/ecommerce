const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
   {
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
            type: String,
         },
      },
      images: [
         {
            type: String,
         },
      ],
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'Please enter user type, e.g user or vendor!'],
      },
      reviews: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
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
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

// schema

productSchema.pre('save', function (next) {
   this.slug = `${this.name}`.split(' ').join('-').toLowerCase();
   next();
});

productSchema.pre(/^find/, function (next) {
   this.find({ isActive: { $eq: true } });
   next();
});
productSchema.virtual('youSave').get(function () {
   return this.price - this.priceDiscount;
   console.log(this.price - this.priceDiscount);
});

module.exports = mongoose.model('Product', productSchema);
