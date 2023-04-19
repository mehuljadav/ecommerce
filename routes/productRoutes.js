const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

router.route('/').get(productController.getProducts);
router.route('/:id').get(productController.getProduct);

// admin protected routes
router
   .route('/')
   .post(
      authController.protect,
      authController.restrictTo('admin'),
      productController.creatProduct
   );

module.exports = router;
