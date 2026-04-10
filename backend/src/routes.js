const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.post('/auth/signup', controllers.signupUser);
router.post('/auth/signin', controllers.signinUser);
router.post('/admin/signin', controllers.signinAdmin);
router.post('/admin/reset-password', controllers.resetAdminPassword);
router.get('/users', controllers.listUsers);
router.post('/coupons', controllers.createCoupon);
router.get('/coupons', controllers.listCoupons);
router.get('/coupons/:code', controllers.getCouponByCode);
router.post('/orders', controllers.createOrder);
router.get('/orders', controllers.listOrders);
router.patch('/orders/:orderId/status', controllers.updateOrderStatus);
router.post('/messages', controllers.createMessage);
router.get('/messages', controllers.listMessages);
router.get('/fuel-prices', controllers.getFuelPrices);
router.patch('/admin/fuel-prices', controllers.setFuelPrices);

module.exports = router;
