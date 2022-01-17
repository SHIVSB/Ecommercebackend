var express = require('express');
const categoryController = require("../../../src/controllers/categoryController");
const orderController = require('../../../src/controllers/orderController');
const productController = require("../../../src/controllers/productController");
const userController = require("../../../src/controllers/userController");
var router = express.Router();

router.post("/user/login", userController.login);
router.post("/user/signup", userController.signup);
// router.post("/user/vendor/details", userController.getVendorDetails);
// router.post("/user/vendor/payments", userController.getVendorPayments);
router.post("/category/all", categoryController.listCategories);
router.post("/product/all", productController.listProducts);
router.post("/product/add", productController.addProduct);
router.post("/product/details", productController.getProductDetails);
router.post("/order/add", orderController.createOrder);
router.post("/order/details", orderController.getOrderDetails);
router.post("/order/edit", orderController.editOrder);

module.exports = router;