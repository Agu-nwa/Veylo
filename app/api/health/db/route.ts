import { connectDB } from "@/lib/server/db";
import { handleApiError } from "@/lib/server/handle-api-error";
import { ok } from "@/lib/server/responses";

export async function GET() {
  try {
    const db = await connectDB();

    return ok({
      service: "veylo-db",
      status: "connected",
      readyState: db.connection.readyState,
      database: db.connection.name,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
