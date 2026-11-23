require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

async function seedAdmin() {
  const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before seeding');
  if (ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters');
  await connectDB(MONGO_URI);
  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) throw new Error('An account with ADMIN_EMAIL already exists; refusing to overwrite it');
  await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, role: 'admin', isActive: true });
  console.log(`Admin account created for ${email}`);
}
seedAdmin().catch((error) => { console.error(`Admin seeder failed: ${error.message}`); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
