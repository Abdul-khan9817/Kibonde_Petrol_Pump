const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  createOrder,
  getOrdersForUser,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', adminAuth, getAllOrders);
router.get('/user/:userId', getOrdersForUser);
router.patch('/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
