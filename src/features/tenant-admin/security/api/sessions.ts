/**
 * [SIGN OUT ALL + ACTIVE SESSIONS] API client
 *
 * Clean, typed wrappers around the new backend endpoints:
 * - GET /auth/sessions
 * - POST /auth/logout-all
 * - POST /auth/sessions/:id/logout
 *
 * Uses the auth-aware axios client so refresh token queueing works automatically.
 *
 * Senior note: Keep this layer thin. Business logic stays on backend.
 */

import apiClient from "@/lib/api/axios-client";

export interface ActiveSession {
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
}

export async function getActiveSessions(): Promise<ActiveSession[]> {
  const { data } = await apiClient.get<ActiveSession[]>("/auth/sessions");
  return data;
}

export async function logoutAllDevices(): Promise<{ message: string; revokedCount: number }> {
  const { data } = await apiClient.post("/auth/logout-all");
  return data;
}

export async function logoutDevice(sessionId: string): Promise<{ message: string }> {
  const { data } = await apiClient.post(`/auth/sessions/${sessionId}/logout`);
  return data;
}
