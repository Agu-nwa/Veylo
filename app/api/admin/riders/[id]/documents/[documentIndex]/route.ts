import { z } from "zod";
import { getSessionUser } from "@/lib/server/auth/session";
import { requireRole } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { AppError } from "@/lib/server/errors";
import { handleApiError } from "@/lib/server/handle-api-error";
import { createAuditLog } from "@/lib/server/audit/audit";
import { RiderProfileModel } from "@/lib/server/models/RiderProfile";
import { ok } from "@/lib/server/responses";
import { readJsonBody, validateBody } from "@/lib/server/validation";

const documentReviewSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  reason: z.string().trim().min(5).max(1000),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; documentIndex: string }> }
) {
  try {
    await connectDB();

    const admin = requireRole(await getSessionUser(), ["ADMIN"]);
    const { id, documentIndex } = await context.params;

    const index = Number(documentIndex);

    if (!Number.isInteger(index) || index < 0) {
      throw new AppError("Invalid document index", 400, "INVALID_DOCUMENT_INDEX");
    }

    const body = await readJsonBody(request);
    const input = validateBody(documentReviewSchema, body);

    const rider = await RiderProfileModel.findById(id);

    if (!rider) {
      throw new AppError("Rider not found", 404, "RIDER_NOT_FOUND");
    }

    const document = rider.documents?.[index];

    if (!document) {
      throw new AppError("Rider document not found", 404, "RIDER_DOCUMENT_NOT_FOUND");
    }

    const before = {
      documentIndex: index,
      type: document.type,
      url: document.url,
      status: document.status,
    };

    document.status = input.status;
    rider.markModified("documents");

    await rider.save();

    await createAuditLog({
      actorId: admin.userId,
      actorRole: admin.role,
      action: "ADMIN_OVERRIDE",
      entityType: "RiderProfile",
      entityId: String(rider._id),
      before,
      after: {
        documentIndex: index,
        type: document.type,
        url: document.url,
        status: document.status,
      },
      reason: input.reason,
    });

    return ok(
      {
        rider,
        document,
      },
      "Rider document reviewed"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
