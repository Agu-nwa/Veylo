import { NextResponse } from "next/server";

export type ApiEnvelope<T> = {
  ok: boolean;
  data: T | null;
  message?: string;
  requestId: string;
  error?: {
    code: string;
    details?: unknown;
  };
};

export function createRequestId() {
  return crypto.randomUUID();
}

export function ok<T>(
  data: T,
  message = "OK",
  status = 200,
  requestId = createRequestId()
) {
  const body: ApiEnvelope<T> = {
    ok: true,
    data,
    message,
    requestId,
  };

  return NextResponse.json(body, { status });
}

export function fail(
  message: string,
  status = 400,
  code = "BAD_REQUEST",
  details?: unknown,
  requestId = createRequestId()
) {
  const body: ApiEnvelope<null> = {
    ok: false,
    data: null,
    message,
    requestId,
    error: {
      code,
      details,
    },
  };

  return NextResponse.json(body, { status });
}
