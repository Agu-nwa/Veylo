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
const RIDER_FULL_NAME = process.env.RIDER_FULL_NAME || "Veylo Verified Rider";
const RIDER_EMAIL = process.env.RIDER_EMAIL;
const RIDER_PHONE = process.env.RIDER_PHONE;
const RIDER_PASSWORD = process.env.RIDER_PASSWORD;
const RIDER_AREA = process.env.RIDER_AREA || "Ikenegbu, Owerri";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required in .env.local");
}

if (!RIDER_EMAIL || !RIDER_PHONE || !RIDER_PASSWORD) {
  throw new Error(
    "RIDER_EMAIL, RIDER_PHONE, and RIDER_PASSWORD are required when running this script"
  );
}

if (RIDER_PASSWORD.length < 8) {
  throw new Error("RIDER_PASSWORD must be at least 8 characters");
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

const RiderProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },
    displayName: String,
    phone: String,
    residentialArea: String,
    bikeAccessType: String,
    dispatchExperience: String,
    referencePhone: String,
    verificationStatus: String,
    rating: Number,
    completedJobs: Number,
    acceptanceRate: Number,
    completionRate: Number,
    disputeRate: Number,
    proofComplianceRate: Number,
    tier: String,
    suspensionStatus: String,
    documents: Array,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const RiderProfile =
  mongoose.models.RiderProfile ||
  mongoose.model("RiderProfile", RiderProfileSchema);

try {
  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  const passwordHash = await bcrypt.hash(RIDER_PASSWORD, 12);

  let user = await User.findOne({
    $or: [{ email: RIDER_EMAIL.toLowerCase() }, { phone: RIDER_PHONE }],
  }).select("+passwordHash");

  if (user) {
    user.fullName = RIDER_FULL_NAME;
    user.email = RIDER_EMAIL.toLowerCase();
    user.phone = RIDER_PHONE;
    user.passwordHash = passwordHash;
    user.role = "RIDER";
    user.accountStatus = "ACTIVE";
    user.verificationStatus = "VERIFIED";
    await user.save();

    console.log("✅ Rider user updated");
  } else {
    user = await User.create({
      fullName: RIDER_FULL_NAME,
      email: RIDER_EMAIL.toLowerCase(),
      phone: RIDER_PHONE,
      passwordHash,
      role: "RIDER",
      accountStatus: "ACTIVE",
      verificationStatus: "VERIFIED",
    });

    console.log("✅ Rider user created");
  }

  let profile = await RiderProfile.findOne({ userId: user._id });

  if (profile) {
    profile.displayName = RIDER_FULL_NAME;
    profile.phone = RIDER_PHONE;
    profile.residentialArea = RIDER_AREA;
    profile.bikeAccessType = "OWN_BIKE";
    profile.dispatchExperience = "1_TO_3_YEARS";
    profile.verificationStatus = "VERIFIED";
    profile.rating = profile.rating || 4.8;
    profile.completedJobs = profile.completedJobs || 0;
    profile.acceptanceRate = profile.acceptanceRate || 95;
    profile.completionRate = profile.completionRate || 96;
    profile.disputeRate = profile.disputeRate || 1;
    profile.proofComplianceRate = profile.proofComplianceRate || 98;
    profile.tier = "PRIORITY";
    profile.suspensionStatus = "NONE";
    profile.documents = profile.documents || [];

    await profile.save();

    console.log("✅ Rider profile updated");
  } else {
    profile = await RiderProfile.create({
      userId: user._id,
      displayName: RIDER_FULL_NAME,
      phone: RIDER_PHONE,
      residentialArea: RIDER_AREA,
      bikeAccessType: "OWN_BIKE",
      dispatchExperience: "1_TO_3_YEARS",
      referencePhone: "",
      verificationStatus: "VERIFIED",
      rating: 4.8,
      completedJobs: 0,
      acceptanceRate: 95,
      completionRate: 96,
      disputeRate: 1,
      proofComplianceRate: 98,
      tier: "PRIORITY",
      suspensionStatus: "NONE",
      documents: [],
    });

    console.log("✅ Rider profile created");
  }

  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Rider profile: ${profile._id}`);
  console.log(`Verification: ${profile.verificationStatus}`);

  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("❌ Failed to seed rider");
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
}
