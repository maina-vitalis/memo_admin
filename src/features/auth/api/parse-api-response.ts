type ApiErrorBody = {
  message?: string | string[];
};

type ApiSuccessBody<T> = {
  success: true;
  data: T;
};

function formatErrorMessage(body: ApiErrorBody | null, fallback: string) {
  if (!body?.message) {
    return fallback;
  }

  return Array.isArray(body.message) ? body.message.join(", ") : body.message;
}

export async function parseApiResponse<T>(
  response: Response,
  fallbackError = "Request failed",
): Promise<T> {
  const body = (await response.json().catch(() => null)) as
    | ApiSuccessBody<T>
    | ApiErrorBody
    | T
    | null;

  if (!response.ok) {
    throw new Error(
      formatErrorMessage(body as ApiErrorBody | null, fallbackError),
    );
  }

  if (body && typeof body === "object" && "data" in body) {
    return body.data;
  }

  return body as T;
}
