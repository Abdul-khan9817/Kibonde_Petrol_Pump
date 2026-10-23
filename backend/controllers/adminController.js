const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const publicAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email || ''
});

const signToken = (admin) =>
  jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });

// POST /api/admin/login   { name, password }  (name can be the admin name OR email)
exports.login = async (req, res) => {
  try {
    const identifier = String(req.body.name || req.body.email || '').trim();
    const password = String(req.body.password || '');

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    const admin = await Admin.findOne({
      $or: [{ name: identifier }, { email: identifier.toLowerCase() }]
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid name or password' });
    }

    return res.json({ token: signToken(admin), ...publicAdmin(admin) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
};

// GET /api/admin/profile
exports.getProfile = async (req, res) => {
  return res.json(publicAdmin(req.admin));
};

// PUT /api/admin/profile   { name, email, currentPassword }
exports.updateProfile = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const currentPassword = String(req.body.currentPassword || '');

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (email && !EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (!currentPassword) {
      return res.status(400).json({ message: 'Enter your current password to save changes' });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!(await bcrypt.compare(currentPassword, admin.password))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const nameTaken = await Admin.findOne({ name, _id: { $ne: admin._id } });
    if (nameTaken) {
      return res.status(409).json({ message: 'Another admin already uses that name' });
    }
    if (email) {
      const emailTaken = await Admin.findOne({ email, _id: { $ne: admin._id } });
      if (emailTaken) {
        return res.status(409).json({ message: 'Another admin already uses that email' });
      }
    }

    admin.name = name;
    // Never store an empty string: it would collide with other admins in the unique index.
    admin.email = email || undefined;
    await admin.save();

    return res.json({ message: 'Profile updated', ...publicAdmin(admin) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'That name or email is already in use' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
};

// PUT /api/admin/password   { currentPassword, newPassword }
exports.changePassword = async (req, res) => {
  try {
    const currentPassword = String(req.body.currentPassword || '');
    const newPassword = String(req.body.newPassword || '');

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    if (newPassword === currentPassword) {
      return res.status(400).json({ message: 'New password must be different from the current one' });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!(await bcrypt.compare(currentPassword, admin.password))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unexpected error occurred' });
  }
};
