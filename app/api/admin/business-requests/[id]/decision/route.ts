import { z } from "zod";
import { Types } from "mongoose";
import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { AppError } from "@/lib/server/errors";
import { handleApiError } from "@/lib/server/handle-api-error";
import { createAuditLog } from "@/lib/server/audit/audit";
import { BusinessProfileModel } from "@/lib/server/models/BusinessProfile";
import { BusinessRequestModel } from "@/lib/server/models/BusinessRequest";
import { UserModel } from "@/lib/server/models/User";
import { ok } from "@/lib/server/responses";
import { readJsonBody, validateBody } from "@/lib/server/validation";

const decisionSchema = z.object({
  decision: z.enum(["APPROVE", "REJECT", "UNDER_REVIEW"]),
  accountStatus: z
    .enum(["PENDING", "ACTIVE", "PAUSED", "SUSPENDED", "REJECTED"])
    .optional()
    .default("ACTIVE"),
  planType: z
    .enum(["PAY_AS_YOU_GO", "GROWTH_VENDOR", "CORPORATE"])
    .optional()
    .default("GROWTH_VENDOR"),
  approvedDiscountRate: z.number().min(0).max(100).optional().default(5),
  discountCap: z.number().min(0).optional().default(500),
  address: z.string().trim().max(240).optional(),
  reason: z.string().trim().min(5).max(1000),
});

const allowedBusinessTypes = new Set([
  "INSTAGRAM_VENDOR",
  "RESTAURANT",
  "BOUTIQUE",
  "OFFICE",
  "SCHOOL",
  "HOTEL",
  "SUPERMARKET",
  "PHARMACY_APPROPRIATE",
  "OTHER_SME",
]);

function normalizeBusinessType(value: string) {
  const normalized = value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const mapped: Record<string, string> = {
    INSTAGRAM_VENDOR: "INSTAGRAM_VENDOR",
    INSTAGRAM: "INSTAGRAM_VENDOR",
    VENDOR: "INSTAGRAM_VENDOR",
    RESTAURANT: "RESTAURANT",
    FOOD_VENDOR: "RESTAURANT",
    BOUTIQUE: "BOUTIQUE",
    OFFICE: "OFFICE",
    SCHOOL: "SCHOOL",
    HOTEL: "HOTEL",
    SUPERMARKET: "SUPERMARKET",
    PHARMACY: "PHARMACY_APPROPRIATE",
    PHARMACY_APPROPRIATE: "PHARMACY_APPROPRIATE",
    OTHER: "OTHER_SME",
    OTHER_SME: "OTHER_SME",
  };

  const result = mapped[normalized] || normalized;

  return allowedBusinessTypes.has(result) ? result : "OTHER_SME";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const admin = requireRole(await getSessionUser(), ["ADMIN"]);
    const { id } = await context.params;

    const body = await readJsonBody(request);
    const input = validateBody(decisionSchema, body);

    const businessRequest = await BusinessRequestModel.findById(id);

    if (!businessRequest) {
      throw new AppError("Business request not found", 404, "BUSINESS_REQUEST_NOT_FOUND");
    }

    const before = {
      status: businessRequest.status,
      reviewedBy: businessRequest.reviewedBy,
      reviewedAt: businessRequest.reviewedAt,
    };

    businessRequest.reviewedBy = new Types.ObjectId(admin.userId);
    businessRequest.reviewedAt = new Date();

    if (input.decision === "UNDER_REVIEW") {
      businessRequest.status = "UNDER_REVIEW";
      await businessRequest.save();

      await createAuditLog({
        actorId: admin.userId,
        actorRole: admin.role,
        action: "ADMIN_OVERRIDE",
        entityType: "BusinessRequest",
        entityId: String(businessRequest._id),
        before,
        after: {
          status: businessRequest.status,
        },
        reason: input.reason,
      });

      return ok(
        {
          request: businessRequest,
          profile: null,
        },
        "Business request moved to review"
      );
    }

    if (input.decision === "REJECT") {
      businessRequest.status = "REJECTED";
      await businessRequest.save();

      await createAuditLog({
        actorId: admin.userId,
        actorRole: admin.role,
        action: "ADMIN_OVERRIDE",
        entityType: "BusinessRequest",
        entityId: String(businessRequest._id),
        before,
        after: {
          status: businessRequest.status,
        },
        reason: input.reason,
      });

      return ok(
        {
          request: businessRequest,
          profile: null,
        },
        "Business request rejected"
      );
    }

    const matchConditions = [];

    if (businessRequest.contactEmail) {
      matchConditions.push({
        email: businessRequest.contactEmail.toLowerCase(),
      });
    }

    if (businessRequest.contactPhone) {
      matchConditions.push({
        phone: businessRequest.contactPhone,
      });
    }

    if (!matchConditions.length) {
      throw new AppError(
        "Business request needs an email or phone to match a user account",
        422,
        "BUSINESS_REQUEST_CONTACT_REQUIRED"
      );
    }

    const userAccount = await UserModel.findOne({
      $or: matchConditions,
    });

    if (!userAccount) {
      throw new AppError(
        "No matching user account found. Ask the business owner to create an account using the same email or phone, then approve again.",
        409,
        "MATCHING_BUSINESS_USER_REQUIRED"
      );
    }

    const profileBefore = await BusinessProfileModel.findOne({
      userId: userAccount._id,
    });

    userAccount.role = "BUSINESS";
    userAccount.accountStatus = "ACTIVE";
    userAccount.verificationStatus = "VERIFIED";

    if (!userAccount.fullName && businessRequest.contactName) {
      userAccount.fullName = businessRequest.contactName;
    }

    await userAccount.save();

    const profile = await BusinessProfileModel.findOneAndUpdate(
      { userId: userAccount._id },
      {
        userId: userAccount._id,
        businessName: businessRequest.businessName,
        businessType: normalizeBusinessType(businessRequest.businessType),
        contactPhone: businessRequest.contactPhone,
        contactEmail: businessRequest.contactEmail,
        address: input.address,
        weeklyDeliveryEstimate: businessRequest.weeklyDeliveryEstimate,
        planType: input.planType,
        accountStatus: input.accountStatus,
        approvedDiscountRate: input.approvedDiscountRate,
        discountCap: input.discountCap,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    businessRequest.status = "APPROVED";
    await businessRequest.save();

    await createAuditLog({
      actorId: admin.userId,
      actorRole: admin.role,
      action: "ADMIN_OVERRIDE",
      entityType: "BusinessRequest",
      entityId: String(businessRequest._id),
      before: {
        ...before,
        existingProfileId: profileBefore?._id ? String(profileBefore._id) : null,
      },
      after: {
        status: businessRequest.status,
        businessProfileId: String(profile._id),
        userId: String(userAccount._id),
        accountStatus: profile.accountStatus,
        planType: profile.planType,
        approvedDiscountRate: profile.approvedDiscountRate,
        discountCap: profile.discountCap,
      },
      reason: input.reason,
    });

    return ok(
      {
        request: businessRequest,
        profile,
      },
      "Business request approved"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
