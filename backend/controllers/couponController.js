const Coupon = require('../models/Coupon');
const User = require('../models/User');

function generateCouponCode() {
  return 'CP' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// GET /api/coupons/:code
exports.getCouponByCode = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.trim().toUpperCase() });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon' });
    return res.json({ discount_percent: coupon.discount_percent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error looking up coupon' });
  }
};

// POST /api/coupons  { user_id, discount_percent }
exports.createCoupon = async (req, res) => {
  try {
    const { user_id, discount_percent } = req.body;
    if (!user_id || !discount_percent) {
      return res.status(400).json({ message: 'Please select both user and discount.' });
    }

    const code = generateCouponCode();
    const coupon = await Coupon.create({ code, discount_percent, user: user_id });
    return res.status(201).json(coupon);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error generating coupon: ' + err.message });
  }
};

// GET /api/coupons/users/list  -> list of users for the admin dropdown
exports.listUsersForCoupons = async (req, res) => {
  try {
    const users = await User.find().select('name email');
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error loading users: ' + err.message });
  }
};
