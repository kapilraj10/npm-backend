import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';

const { MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in env');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URL);
  const email = ADMIN_EMAIL.toLowerCase().trim();
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.passwordHash = hash;
    existing.role = 'admin';
    await existing.save();
    console.log('Admin user updated:', email);
  } else {
    await User.create({ email, passwordHash: hash, role: 'admin' });
    console.log('Admin user created:', email);
  }
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
