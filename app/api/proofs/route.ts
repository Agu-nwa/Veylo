import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { createProof } from "@/lib/server/proofs/proof-service";
import { proofCreateSchema } from "@/lib/server/proofs/schemas";
import { readJsonBody, validateBody } from "@/lib/server/validation";
import { ok } from "@/lib/server/responses";

export async function POST(request: Request) {
  try {
    await connectDB();

    const user = requireUser(await getSessionUser());
    const body = await readJsonBody(request);
    const input = validateBody(proofCreateSchema, body);

    const proof = await createProof(input, user);

    return ok(
      {
        proof,
      },
      "Proof uploaded",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
