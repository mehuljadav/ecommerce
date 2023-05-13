const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Book order
exports.ordperProduct = catchAsync(async (req, res, next) => {
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

exports.getOrder = catchAsync(async (req, res, next) => {});
