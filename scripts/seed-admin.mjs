import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local not found");
  }

  const lines = fs.readFileSync(envPath, "utf8").split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");

    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME || "Veylo Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PHONE = process.env.ADMIN_PHONE;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required in .env.local");
}

if (!ADMIN_EMAIL || !ADMIN_PHONE || !ADMIN_PASSWORD) {
  throw new Error(
    "ADMIN_EMAIL, ADMIN_PHONE, and ADMIN_PASSWORD are required when running this script"
  );
}

if (ADMIN_PASSWORD.length < 8) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters");
}

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "RIDER", "BUSINESS", "ADMIN"],
      default: "CUSTOMER",
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "PENDING", "SUSPENDED", "CLOSED"],
      default: "ACTIVE",
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"],
      default: "VERIFIED",
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

try {
  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const existing = await User.findOne({
    $or: [{ email: ADMIN_EMAIL.toLowerCase() }, { phone: ADMIN_PHONE }],
  }).select("+passwordHash");

  if (existing) {
    existing.fullName = ADMIN_FULL_NAME;
    existing.email = ADMIN_EMAIL.toLowerCase();
    existing.phone = ADMIN_PHONE;
    existing.passwordHash = passwordHash;
    existing.role = "ADMIN";
    existing.accountStatus = "ACTIVE";
    existing.verificationStatus = "VERIFIED";

    await existing.save();

    console.log("✅ Admin user updated");
    console.log(`Email: ${existing.email}`);
    console.log(`Role: ${existing.role}`);
  } else {
    const admin = await User.create({
      fullName: ADMIN_FULL_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      phone: ADMIN_PHONE,
      passwordHash,
      role: "ADMIN",
      accountStatus: "ACTIVE",
      verificationStatus: "VERIFIED",
    });

    console.log("✅ Admin user created");
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
  }

  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("❌ Failed to seed admin user");
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
}
