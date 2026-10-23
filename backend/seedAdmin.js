// One-off script to create (or reset) an admin account, since there is no admin signup form.
// Usage: node seedAdmin.js <name> <password> [email]
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

async function run() {
  const [name, password, email] = process.argv.slice(2);
  if (!name || !password) {
    console.log('Usage: node seedAdmin.js <name> <password> [email]');
    process.exit(1);
  }

  await connectDB();
  const hashedPassword = await bcrypt.hash(password, 10);
  const existing = await Admin.findOne({ name });

  if (existing) {
    existing.password = hashedPassword;
    if (email) existing.email = email;
    await existing.save();
    console.log(`Admin "${name}" updated.`);
    process.exit(0);
  }

  await Admin.create({ name, password: hashedPassword, ...(email ? { email } : {}) });
  console.log(`Admin "${name}" created.`);
  process.exit(0);
}

run();
