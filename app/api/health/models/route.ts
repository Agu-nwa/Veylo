import "@/lib/server/models";
import mongoose from "mongoose";
import { ok } from "@/lib/server/responses";

export async function GET() {
  return ok({
    service: "veylo-models",
    status: "loaded",
    models: mongoose.modelNames().sort(),
    count: mongoose.modelNames().length,
  });
}
