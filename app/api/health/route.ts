import { ok } from "@/lib/server/responses";

export async function GET() {
  return ok({
    service: "veylo-api",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
