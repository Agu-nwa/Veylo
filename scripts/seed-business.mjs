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
const BUSINESS_FULL_NAME = process.env.BUSINESS_FULL_NAME || "Veylo Business Owner";
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;
const BUSINESS_PHONE = process.env.BUSINESS_PHONE;
const BUSINESS_PASSWORD = process.env.BUSINESS_PASSWORD;
const BUSINESS_NAME = process.env.BUSINESS_NAME || "Veylo Demo Business";
const BUSINESS_TYPE = process.env.BUSINESS_TYPE || "Instagram vendor";
const BUSINESS_ADDRESS = process.env.BUSINESS_ADDRESS || "Ikenegbu, Owerri";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required in .env.local");
}

if (!BUSINESS_EMAIL || !BUSINESS_PHONE || !BUSINESS_PASSWORD) {
  throw new Error(
    "BUSINESS_EMAIL, BUSINESS_PHONE, and BUSINESS_PASSWORD are required when running this script"
  );
}

if (BUSINESS_PASSWORD.length < 8) {
  throw new Error("BUSINESS_PASSWORD must be at least 8 characters");
}

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    role: String,
    accountStatus: String,
    verificationStatus: String,
    lastLoginAt: Date,
  },
  { timestamps: true }
);

const BusinessProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },
    businessName: String,
    businessType: String,
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    address: String,
    weeklyDeliveryEstimate: String,
    planType: String,
    accountStatus: String,
    approvedDiscountRate: Number,
    discountCap: Number,
    monthlyOrderCount: Number,
    notes: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const BusinessProfile =
  mongoose.models.BusinessProfile ||
  mongoose.model("BusinessProfile", BusinessProfileSchema);

try {
  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  const passwordHash = await bcrypt.hash(BUSINESS_PASSWORD, 12);

  let user = await User.findOne({
    $or: [
      { email: BUSINESS_EMAIL.toLowerCase() },
      { phone: BUSINESS_PHONE },
    ],
  }).select("+passwordHash");

  if (user) {
    user.fullName = BUSINESS_FULL_NAME;
    user.email = BUSINESS_EMAIL.toLowerCase();
    user.phone = BUSINESS_PHONE;
    user.passwordHash = passwordHash;
    user.role = "BUSINESS";
    user.accountStatus = "ACTIVE";
    user.verificationStatus = "VERIFIED";

    await user.save();

    console.log("✅ Business user updated");
  } else {
    user = await User.create({
      fullName: BUSINESS_FULL_NAME,
      email: BUSINESS_EMAIL.toLowerCase(),
      phone: BUSINESS_PHONE,
      passwordHash,
      role: "BUSINESS",
      accountStatus: "ACTIVE",
      verificationStatus: "VERIFIED",
    });

    console.log("✅ Business user created");
  }

  let profile = await BusinessProfile.findOne({ userId: user._id });

  if (profile) {
    profile.businessName = BUSINESS_NAME;
    profile.businessType = BUSINESS_TYPE;
    profile.contactName = BUSINESS_FULL_NAME;
    profile.contactPhone = BUSINESS_PHONE;
    profile.contactEmail = BUSINESS_EMAIL.toLowerCase();
    profile.address = BUSINESS_ADDRESS;
    profile.weeklyDeliveryEstimate = "16 - 40 deliveries weekly";
    profile.planType = "GROWTH_VENDOR";
    profile.accountStatus = "ACTIVE";
    profile.approvedDiscountRate = 5;
    profile.discountCap = 500;
    profile.monthlyOrderCount = profile.monthlyOrderCount || 0;
    profile.notes = "Seeded local approved business account for Veylo testing.";

    await profile.save();

    console.log("✅ Business profile updated");
  } else {
    profile = await BusinessProfile.create({
      userId: user._id,
      businessName: BUSINESS_NAME,
      businessType: BUSINESS_TYPE,
      contactName: BUSINESS_FULL_NAME,
      contactPhone: BUSINESS_PHONE,
      contactEmail: BUSINESS_EMAIL.toLowerCase(),
      address: BUSINESS_ADDRESS,
      weeklyDeliveryEstimate: "16 - 40 deliveries weekly",
      planType: "GROWTH_VENDOR",
      accountStatus: "ACTIVE",
      approvedDiscountRate: 5,
      discountCap: 500,
      monthlyOrderCount: 0,
      notes: "Seeded local approved business account for Veylo testing.",
    });

    console.log("✅ Business profile created");
  }

  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Business: ${profile.businessName}`);
  console.log(`Status: ${profile.accountStatus}`);
  console.log(`Plan: ${profile.planType}`);

  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("❌ Failed to seed business account");
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
}
