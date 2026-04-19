import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import userModel from './models/userModel.js';
import { USER_ROLES } from './constants/roles.js';

const [usernameArg, emailArg, passwordArg, nameArg] = process.argv.slice(2);

const username = (usernameArg || '').trim().toLowerCase();
const email = (emailArg || '').trim().toLowerCase();
const password = (passwordArg || '').trim();
const name = (nameArg || 'Admin User').trim();

const printUsageAndExit = () => {
  console.log('Usage: npm run create-admin -- <username> <email> <password> [name]');
  process.exit(1);
};

if (!username || !email || !password) {
  printUsageAndExit();
}

if (password.length < 6) {
  console.log('Password must be at least 6 characters.');
  process.exit(1);
}

const run = async () => {
  try {
    await connectDB();

    const existing = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing) {
      existing.name = name;
      existing.username = username;
      existing.email = email;
      existing.password = hashedPassword;
      existing.role = USER_ROLES.ADMIN;
      await existing.save();
      console.log(`Updated existing user as admin: ${email}`);
    } else {
      await userModel.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: USER_ROLES.ADMIN,
      });
      console.log(`Created admin user: ${email}`);
    }
  } catch (error) {
    console.error('Failed to create admin user:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
