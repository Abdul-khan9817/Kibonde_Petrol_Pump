const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protects admin-only routes. Expects:  Authorization: Bearer <token>
module.exports = async function adminAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Not authorized. Please log in.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    const admin = await Admin.findById(payload.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin account no longer exists.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
};
