const express = require('express');
const userController = require('./controllers/userController');
const productController = require('./controllers/productController');

const router = express.Router();

router.use('/users', userController);
router.use('/product', productController);

module.exports = router;