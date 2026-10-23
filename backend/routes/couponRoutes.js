const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getCouponByCode,
  createCoupon,
  listUsersForCoupons
} = require('../controllers/couponController');

router.get('/users/list', adminAuth, listUsersForCoupons);
router.get('/:code', getCouponByCode);
router.post('/', adminAuth, createCoupon);

module.exports = router;
