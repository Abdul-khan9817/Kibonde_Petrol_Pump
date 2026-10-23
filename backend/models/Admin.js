const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    // Optional + sparse so existing admins (without an email) keep working.
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
