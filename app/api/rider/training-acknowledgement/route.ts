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

const trainingSchema = z.object({
  otpRulesAccepted: z.boolean(),
  proofRulesAccepted: z.boolean(),
  packageHandlingAccepted: z.boolean(),
  conductRulesAccepted: z.boolean(),
  supportRulesAccepted: z.boolean(),
  safetyRulesAccepted: z.boolean(),
  acknowledgementName: z.string().trim().min(2).max(120),
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const body = await readJsonBody(request);
    const input = validateBody(trainingSchema, body);

    const accepted =
      input.otpRulesAccepted &&
      input.proofRulesAccepted &&
      input.packageHandlingAccepted &&
      input.conductRulesAccepted &&
      input.supportRulesAccepted &&
      input.safetyRulesAccepted;

    if (!accepted) {
      throw new AppError(
        "All rider training checklist items must be accepted",
        422,
        "RIDER_TRAINING_INCOMPLETE"
      );
    }

    const profile = await RiderProfileModel.findOne({ userId: user.userId });

    if (!profile) {
      throw new AppError(
        "Rider application not found. Submit rider application first.",
        404,
        "RIDER_PROFILE_NOT_FOUND"
      );
    }

    const existingIndex = profile.documents.findIndex(
      (document: any) => document.type === "TRAINING_ACKNOWLEDGEMENT"
    );

    const acknowledgementUrl = `internal://veylo/rider-training/${profile._id}/${Date.now()}`;

    if (existingIndex >= 0) {
      profile.documents[existingIndex].url = acknowledgementUrl;
      profile.documents[existingIndex].status = "PENDING";
    } else {
      profile.documents.push({
        type: "TRAINING_ACKNOWLEDGEMENT",
        url: acknowledgementUrl,
        status: "PENDING",
      });
    }

    await profile.save();

    await createAuditLog({
      actorId: user.userId,
      actorRole: user.role,
      action: "ADMIN_OVERRIDE",
      entityType: "RiderProfile",
      entityId: String(profile._id),
      after: {
        trainingAcknowledgementSubmitted: true,
        acknowledgementName: input.acknowledgementName,
        checklist: {
          otpRulesAccepted: input.otpRulesAccepted,
          proofRulesAccepted: input.proofRulesAccepted,
          packageHandlingAccepted: input.packageHandlingAccepted,
          conductRulesAccepted: input.conductRulesAccepted,
          supportRulesAccepted: input.supportRulesAccepted,
          safetyRulesAccepted: input.safetyRulesAccepted,
        },
      },
    });

    return ok(
      {
        profile,
        documents: profile.documents,
      },
      "Rider training acknowledgement submitted",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
