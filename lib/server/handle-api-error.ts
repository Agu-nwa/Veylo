import { fail } from "@/lib/server/responses";
import { isAppError } from "@/lib/server/errors";

export function handleApiError(error: unknown) {
  if (isAppError(error)) {
    return fail(error.message, error.status, error.code, error.details);
  }

  console.error("[VEYLO_API_ERROR]", error);

  return fail("Something went wrong", 500, "INTERNAL_SERVER_ERROR");
}
