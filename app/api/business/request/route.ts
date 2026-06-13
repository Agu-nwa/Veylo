import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { createBusinessRequest } from "@/lib/server/business/business-service";
import { businessRequestSchema } from "@/lib/server/business/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await readJsonBody(request);
    const input = validateBody(businessRequestSchema, body);

    const businessRequest = await createBusinessRequest(input);

    return ok(
      {
        businessRequest,
      },
      "Business request created",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
