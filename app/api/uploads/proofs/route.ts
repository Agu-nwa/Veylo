import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import { getSessionUser } from "@/lib/server/auth/session";
import { requireUser } from "@/lib/server/auth/rbac";
import { AppError } from "@/lib/server/errors";
import { handleApiError } from "@/lib/server/handle-api-error";
import { ok } from "@/lib/server/responses";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["application/pdf", "pdf"],
]);

export async function POST(request: Request) {
  try {
    requireUser(await getSessionUser());

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new AppError("No file uploaded", 400, "FILE_REQUIRED");
    }

    if (!allowedTypes.has(file.type)) {
      throw new AppError(
        "Only JPG, PNG, WEBP, and PDF proof files are allowed",
        422,
        "UNSUPPORTED_FILE_TYPE"
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new AppError("File must not exceed 5MB", 422, "FILE_TOO_LARGE");
    }

    const extension = allowedTypes.get(file.type);
    const filename = `${randomUUID()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "proofs");
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filepath, buffer);

    return ok(
      {
        imageUrl: `/uploads/proofs/${filename}`,
        filename,
        contentType: file.type,
        size: file.size,
      },
      "Proof file uploaded",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
