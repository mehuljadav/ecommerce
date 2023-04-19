const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email');

const User = require('../models/userModel');

createSendToken = (user, statusCode, req, res) => {
   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRESIN,
   });

   res.cookie('jwt', token, {
      httpOnly: true,
      expires: new Date(
         Date.now() + process.env.COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
   });

   // Remove password from output
   user.password = undefined;

   res.status(statusCode).json({
      status: 'success',
      token,
      data: {
         user,
      },
   });
};

exports.signup = catchAsync(async (req, res, next) => {
   const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
   });

   // const url = `${req.protocol}://${req.get('host')}/me`;
   // await new Email(newUser, url).sendWelcome();

   createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
   }

   const user = await User.findOne({ email }).select('+password');
   if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
   }

   // 3) If everything ok, send token to client
   createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
   res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now()),
      httpOnly: true,
   });
   res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
   } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
   }

   if (!token) {
      return next(
         new AppError('You are not logged in! Please log in to get access.', 401)
      );
   }

   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

   // 3) Check if user still exists
   const currentUser = await User.findById(decoded.id);
   if (!currentUser) {
      return next(
         new AppError('The user belonging to this token does no longer exist.', 401)
      );
   }

   // 4) Check if user changed password after the token was issued
   if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
         new AppError('User recently changed password! Please log in again.', 401)
      );
   }

   // GRANT ACCESS TO PROTECTED ROUTE
   req.user = currentUser;
   res.locals.user = currentUser;
   next();
});

exports.restrictTo = (...roles) => {
   return (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
         return next(
            new AppError('You do not have permission to perform this action', 403)
         );
      }

      next();
   };
};
