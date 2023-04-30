const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const imageUploader = require('../utils/imageUploader');

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
      return next(new AppError(`Product not found with id: ${req.params.id}`, 401));
   }

   res.status(200).json({
      status: 'success',
      data: product,
   });
});

exports.creatProduct = catchAsync(async (req, res, next) => {
   const product = await Product.create(req.body);
   if (!product) {
      return next(new AppError('Product cannot be created!', 401));
   }

   res.status(201).json({
      status: 'success',
      data: { product },
   });
});

// exports.removeFilesBeforeUpdate = catchAsync(async (req, res, next) => {
//    if (req.files) {
//       console.log('yes there is a files');
//       console.log('removeFilesBeforeUpdate', req.files);
//    }
//    console.log('removeFilesBeforeUpdate', req.files);
//    const product = await Product.findById(req.params.id);
//    next();
// });
exports.updateProduct = catchAsync(async (req, res, next) => {
   let product = await Product.findById(req.params.id);
   if (req.body.name) {
      req.body.slug = `${req.body.name}`.split(' ').join('-').toLowerCase();
   }

   product = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
   });

   if (!product) {
      return next(new AppError('Product cannot be created!', 401));
   }
   res.status(200).json({
      status: 'success',
      data: { product },
   });
});
