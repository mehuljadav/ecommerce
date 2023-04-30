const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const imageUpload = require('../utils/imageUploader');
router.route('/').get(productController.getProducts);
router.route('/:id').get(productController.getProduct);

// admin protected routes
router
   .route('/')
   .post(
      authController.protect,
      imageUpload.uploadImages,
      imageUpload.resizeImage,
      productController.creatProduct
   )
   .get(productController.getProducts);

router
   .route('/:id')
   .get(productController.getProduct)
   .patch(
      authController.protect,
      imageUpload.uploadImages,
      imageUpload.resizeImage,
      productController.updateProduct
   )
   .delete(imageUpload.deleteImage, productController.deleteProduct);

module.exports = router;
