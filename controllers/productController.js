const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');

exports.getProducts = catchAsync(async (req, res, next) => {
   const products = await Product.find();
   if (!products) {
      return next(new AppError('Product not found', 400));
   }

   res.status(200).json({
      status: 'success',
      length: products.length,
      data: { products },
   });
});

exports.getProduct = catchAsync(async (req, res, next) => {
   const product = await Product.findById(req.params.id);

   if (!product) {
      return next(new AppError(`Product not found with id: ${req.params.id}`, 400));
   }

   res.status(200).json({
      status: 'success',
      data: product,
   });
});

exports.creatProduct = catchAsync(async (req, res, next) => {
   console.log(req.body);
   const newProduct = await Product.create(req.body);

   res.status(201).json({
      status: 'success',
      data: { newProduct },
   });
});
