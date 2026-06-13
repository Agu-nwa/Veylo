import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { AppError } from "@/lib/server/errors";
import { handleApiError } from "@/lib/server/handle-api-error";
import { RiderProfileModel } from "@/lib/server/models/RiderProfile";
import { UserModel } from "@/lib/server/models/User";
import { ok } from "@/lib/server/responses";
import { readJsonBody, validateBody } from "@/lib/server/validation";

const riderApplicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(30),
  residentialArea: z.string().trim().min(2).max(160),
  bikeAccessType: z.enum(["OWN_BIKE", "PERMISSIONED_BIKE", "FLEET", "OTHER"]),
  dispatchExperience: z.enum([
    "LESS_THAN_6_MONTHS",
    "6_TO_12_MONTHS",
    "1_TO_3_YEARS",
    "3_PLUS_YEARS",
  ]),
  referencePhone: z.string().trim().min(7).max(30),
  experienceNote: z.string().trim().max(1000).optional(),
  conductAccepted: z.boolean(),
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await readJsonBody(request);
    const input = validateBody(riderApplicationSchema, body);

    if (!input.conductAccepted) {
      throw new AppError(
        "Rider conduct rules must be accepted",
        422,
        "RIDER_CONDUCT_REQUIRED"
      );
    }

    const user = await UserModel.findOne({
      $or: [
        { email: input.email.toLowerCase() },
        { phone: input.phone },
      ],
    });

    if (!user) {
      throw new AppError(
        "Create a Veylo user account with the same email or phone before applying as a rider.",
        409,
        "MATCHING_USER_ACCOUNT_REQUIRED"
      );
    }

    if (user.role === "ADMIN") {
      throw new AppError(
        "Admin accounts cannot apply as riders",
        409,
        "ADMIN_CANNOT_APPLY_AS_RIDER"
      );
    }

    user.fullName = input.fullName;
    user.email = input.email.toLowerCase();
    user.phone = input.phone;
    await user.save();

    const profile = await RiderProfileModel.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        displayName: input.fullName,
        phone: input.phone,
        residentialArea: input.residentialArea,
        bikeAccessType: input.bikeAccessType,
        dispatchExperience: input.dispatchExperience,
        referencePhone: input.referencePhone,
        verificationStatus: "PENDING",
        tier: "NEW",
        suspensionStatus: "NONE",
        documents: [],
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return ok(
      {
        profile,
        note: input.experienceNote || "",
      },
      "Rider application submitted",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
