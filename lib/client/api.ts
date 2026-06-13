export type ApiEnvelope<T> = {
  ok: boolean;
  data: T | null;
  message?: string;
  requestId: string;
  error?: {
    code: string;
    details?: any;
  };
};

function formatApiError(payload: ApiEnvelope<unknown>) {
  const details = payload.error?.details;

  if (payload.error?.code === "VALIDATION_ERROR" && details?.fieldErrors) {
    const messages = Object.entries(details.fieldErrors)
      .flatMap(([field, errors]) =>
        Array.isArray(errors)
          ? errors.map((error) => `${field}: ${error}`)
          : []
      )
      .join(", ");

    return messages || payload.message || "Validation failed";
  }

  return payload.message || "Request failed";
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiEnvelope<T>> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.ok) {
    throw new Error(formatApiError(payload));
  }

  return payload;
}
