import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { USER_ROLES } from "../constants/roles.js";

const getAdminSeedFromEnv = () => {
  const username = (process.env.ADMIN_USERNAME || "").trim().toLowerCase();
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || "").trim();
  const name = (process.env.ADMIN_NAME || "System Admin").trim();

  return { username, email, password, name };
};

export const ensureInitialAdminUser = async () => {
  const { username, email, password, name } = getAdminSeedFromEnv();

  if (!username || !email || !password) {
    console.log("Initial admin seed skipped (set ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD in .env)");
    return;
  }

  if (password.length < 6) {
    console.log("Initial admin seed skipped (ADMIN_PASSWORD must be at least 6 characters)");
    return;
  }

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
    console.log(`Initial admin is ready: ${email}`);
    return;
  }

  await userModel.create({
    name,
    username,
    email,
    password: hashedPassword,
    role: USER_ROLES.ADMIN,
  });

  console.log(`Initial admin created from .env: ${email}`);
};
