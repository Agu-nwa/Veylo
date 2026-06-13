import { z } from "zod";
import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { AppError } from "@/lib/server/errors";
import { handleApiError } from "@/lib/server/handle-api-error";
import { createAuditLog } from "@/lib/server/audit/audit";
import { RiderProfileModel } from "@/lib/server/models/RiderProfile";
import { ok } from "@/lib/server/responses";
import { readJsonBody, validateBody } from "@/lib/server/validation";

const riderDocumentSchema = z.object({
  type: z
    .enum([
      "GOVERNMENT_ID",
      "RIDER_PHOTO",
      "BIKE_DOCUMENT",
      "BIKE_PERMISSION",
      "REFERENCE_NOTE",
      "TRAINING_ACKNOWLEDGEMENT",
      "OTHER",
    ])
    .default("OTHER"),
  url: z.string().trim().min(3).max(500),
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const body = await readJsonBody(request);
    const input = validateBody(riderDocumentSchema, body);

    const profile = await RiderProfileModel.findOne({ userId: user.userId });

    if (!profile) {
      throw new AppError(
        "Rider application not found. Submit rider application first.",
        404,
        "RIDER_PROFILE_NOT_FOUND"
      );
    }

    profile.documents.push({
      type: input.type,
      url: input.url,
      status: "PENDING",
    });

    await profile.save();

    await createAuditLog({
      actorId: user.userId,
      actorRole: user.role,
      action: "ADMIN_OVERRIDE",
      entityType: "RiderProfile",
      entityId: String(profile._id),
      after: {
        documentUploaded: true,
        type: input.type,
        url: input.url,
      },
    });

    return ok(
      {
        profile,
        documents: profile.documents,
      },
      "Rider document added",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
