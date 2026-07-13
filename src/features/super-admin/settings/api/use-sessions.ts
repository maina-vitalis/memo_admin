"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getActiveSessions,
  logoutAllDevices,
  logoutDevice,
  type ActiveSession,
} from "@/features/super-admin/settings/api/sessions";

const QUERY_KEY = ["settings", "sessions"] as const;

export function useActiveSessions() {
  return useQuery<ActiveSession[]>({
    queryKey: QUERY_KEY,
    queryFn: getActiveSessions,
    staleTime: 30_000,
  });
}

export function useLogoutAllDevices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAllDevices,
    onSuccess: (res) => {
      toast.success(res.message || "Signed out from all devices");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to sign out all devices",
      );
    },
  });
}

export function useLogoutDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => logoutDevice(sessionId),
    onSuccess: () => {
      toast.success("Device signed out");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to sign out device",
      );
    },
  });
}
