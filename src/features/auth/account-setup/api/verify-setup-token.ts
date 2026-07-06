import apiClient from "@/lib/api/axios-client";
import type { SetupTokenDetails } from "@/features/auth/account-setup/types/account-setup";
import axios from "axios";

type ApiEnvelope<T> = { success: true; data: T };

export class SetupTokenError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "SetupTokenError";
  }
}

export async function verifySetupToken(
  token: string,
): Promise<SetupTokenDetails> {
  try {
    const { data: raw } = await apiClient.post<
      ApiEnvelope<SetupTokenDetails> | SetupTokenDetails
    >("/auth/setup/verify", { token });

    if (raw && typeof raw === "object" && "data" in raw) {
      return (raw as ApiEnvelope<SetupTokenDetails>).data;
    }

    return raw as SetupTokenDetails;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string | string[] } | undefined;
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : (data?.message ?? "Invalid or expired setup link");
      throw new SetupTokenError(message, err.response?.status);
    }
    throw new SetupTokenError(
      err instanceof Error ? err.message : "Invalid or expired setup link",
    );
  }
}
