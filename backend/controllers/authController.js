const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      mobile_number: mobile || ''
    });

    return res.status(201).json({
      message: 'Account created successfully. You can now sign in.',
      user_id: user._id,
      name: user.name
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      user_id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
};
