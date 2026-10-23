const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/adminController');

router.post('/login', login);

router.get('/profile', adminAuth, getProfile);
router.put('/profile', adminAuth, updateProfile);
router.put('/password', adminAuth, changePassword);

module.exports = router;
