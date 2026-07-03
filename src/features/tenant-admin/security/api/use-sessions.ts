/**
 * [SIGN OUT ALL + ACTIVE SESSIONS] React Query hooks
 *
 * Clean separation: API in sessions.ts, consumption hooks here.
 * Provides loading, error, invalidate after logout actions.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveSessions, logoutAllDevices, logoutDevice, type ActiveSession } from "./sessions";
import { toast } from "sonner";

const QUERY_KEY = ["auth", "sessions"] as const;

export function useActiveSessions() {
  return useQuery<ActiveSession[]>({
    queryKey: QUERY_KEY,
    queryFn: getActiveSessions,
    staleTime: 30_000, // 30s is enough for a security view
  });
}

export function useLogoutAllDevices() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logoutAllDevices,
    onSuccess: (res) => {
      toast.success(res.message || "Signed out from all devices");
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      // Note: caller should also clear local auth state and redirect
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to sign out all devices");
    },
  });
}

export function useLogoutDevice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => logoutDevice(sessionId),
    onSuccess: () => {
      toast.success("Device signed out");
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to sign out device");
    },
  });
}
