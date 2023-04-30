const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Memory storage instead of diskStorage, will store in buffer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
   console.log(file.mimetype);
   if (file.mimetype.startsWith('image')) {
      console.log('here');
      cb(null, true);
   } else {
      cb(new AppError('Not an image, upload image only!', 400), false);
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
   console.log('IN', req.files);
   //1) logo - single image
   req.body.brand.logo = `${req.body.brand.name}-logo.jpeg`;

   await sharp(req.files.logo[0].buffer)
      .resize(1000, 1000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/brand_logos/${req.body.brand.logo}`);

   // 2) images
   req.body.images = [];
   console.log('yes there is a image');
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
         console.log('yes there is a image and pushed it');
      })
   );
   next();
});
