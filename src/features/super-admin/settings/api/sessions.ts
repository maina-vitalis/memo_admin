import { apiRequest } from "@/lib/api/http";

export type ActiveSession = {
  id: string;
  deviceName: string | null;
  deviceType: string | null;
  deviceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string;
  current?: boolean;
};

export async function getActiveSessions(): Promise<ActiveSession[]> {
  return apiRequest<ActiveSession[]>("/auth/sessions", { auth: true });
}

export async function logoutAllDevices(): Promise<{
  message: string;
  revokedCount: number;
}> {
  return apiRequest("/auth/logout-all", { method: "POST", auth: true });
}

export async function logoutDevice(
  sessionId: string,
): Promise<{ message: string }> {
  return apiRequest(`/auth/sessions/${sessionId}/logout`, {
    method: "POST",
    auth: true,
  });
}
