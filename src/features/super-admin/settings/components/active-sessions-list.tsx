"use client";

import { formatDistanceToNow } from "date-fns";
import { LogOutIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import type { ActiveSession } from "@/features/super-admin/settings/api/sessions";
import { useLogoutDevice } from "@/features/super-admin/settings/api/use-sessions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ActiveSessionsList({ sessions }: { sessions: ActiveSession[] }) {
  const logoutDevice = useLogoutDevice();

  if (!sessions.length) {
    return <p className="text-muted-foreground">No active sessions found.</p>;
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isCurrent = !!session.current;
        const deviceLabel = session.deviceName || session.deviceType || "Unknown device";
        const Icon = session.deviceType?.includes("mobile") ? SmartphoneIcon : MonitorIcon;

        return (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-1 size-5 text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2 font-medium">
                  {deviceLabel}
                  {isCurrent && (
                    <Badge variant="secondary" className="text-xs">
                      This device
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {session.lastUsedAt
                    ? `Last active ${formatDistanceToNow(new Date(session.lastUsedAt), { addSuffix: true })}`
                    : `Signed in ${formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}`}
                </div>
                {session.ipAddress && (
                  <div className="mt-0.5 text-xs text-muted-foreground/70">
                    {session.ipAddress}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={logoutDevice.isPending}
              onClick={() => logoutDevice.mutate(session.id)}
            >
              <LogOutIcon className="mr-2 size-4" />
              Sign out
            </Button>
          </div>
        );
      })}
    </div>
  );
}
