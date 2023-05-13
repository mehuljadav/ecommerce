const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Book order
exports.newOrder = catchAsync(async (req, res, next) => {
   //1. req.body create
   const order = await Order.create(req.body);
   if (!order) {
      return next(new AppError('Order placing failed!', 400));
   }
   res.status(201).json({
      status: 'success',
      data: {
         order,
      },
   });
});

exports.getAllOrder = catchAsync(async (req, res, next) => {
   const order = await Order.find().populate({
      path: 'user',
      select: 'name email',
   });

   if (!order) {
      return next(new AppError('Order not Found!', 404));
   }
   res.status(200).json({
      status: 'success',
      data: { order },
   });
});

exports.getOrder = catchAsync(async (req, res, next) => {
   const order = await Order.find({ _id: req.params.id }).populate({
      path: 'user',
      select: 'name email',
   });

   if (!order) {
      return next(new AppError('Order not Found!', 404));
   }
   res.status(200).json({
      status: 'success',
      data: { order },
   });
});
