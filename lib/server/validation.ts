import { z } from "zod";
import { AppError } from "@/lib/server/errors";

export function validateBody<T>(schema: z.Schema<T>, body: unknown): T {
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new AppError(
      "Invalid request body",
      422,
      "VALIDATION_ERROR",
      parsed.error.flatten()
    );
  }

  return parsed.data;
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new AppError("Invalid JSON body", 400, "INVALID_JSON");
  }
}
