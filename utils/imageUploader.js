const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');

// Memory storage instead of diskStorage, will store in buffer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith('image')) {
      cb(null, true);
   } else {
      return cb(new AppError('Not an image, upload image only!', 400), false);
   }
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
});

exports.uploadImages = upload.fields([
   { name: 'logo', maxCount: 1 },
   { name: 'images', maxCount: 3 },
]);

exports.resizeImage = catchAsync(async (req, res, next) => {
   if (!req.files) return next();
   if (!req.files.logo || !req.files.images) return next();

   //1) logo - single image
   req.body.brand.logo = `${req.body.brand.name}-logo.jpeg`;

   await sharp(req.files.logo[0].buffer)
      .resize(1000, 1000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/brand_logos/${req.body.brand.logo}`);

   // 2) images
   req.body.images = [];

   await Promise.all(
      req.files.images.map(async (file, i) => {
         const slugForFile = `${req.body.name}`.split(' ').join('-').toLowerCase();
         console.log(slugForFile);
         const fileName = `${slugForFile}-${i + 1}.jpeg`;
         await sharp(file.buffer)
            .resize(1000, 1000)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/images/product/${fileName}`);

         req.body.images.push(fileName);
      })
   );
   next();
});

exports.deleteImage = catchAsync(async (req, res, next) => {
   console.log('here');
   const product = await Product.findById(req.params.id);
   if (!product) {
      return next(new AppError('Product not found!', 404));
   }
   console.log(product);
   if (product.brand.logo) {
      fs.unlink(`public/images/brand_logos/${product.brand.logo}`, (err) => {
         if (err) console.log(err);
      });
   }

   if (product.images) {
      product.images.forEach((image) => {
         fs.unlink(`public/images/product/${image}`, (err) => {
            if (err) console.log(err);
         });
      });
   }
   next();
});
