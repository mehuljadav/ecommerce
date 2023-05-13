const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
router.route('/').post(orderController.newOrder).get(orderController.getAllOrder);
router.route('/:id').get(orderController.getOrder);

module.exports = router;
