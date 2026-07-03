/**
 * [SIGN OUT ALL + ACTIVE SESSIONS] Reusable list component
 *
 * Displays active devices/sessions with:
 * - Device info
 * - Last active
 * - Current badge
 * - Individual "Sign out" button
 *
 * Designed to be dropped into a page or modal.
 * Very maintainable: pure presentation + small actions.
 */

"use client";

import { formatDistanceToNow } from "date-fns";
import { SmartphoneIcon, MonitorIcon, LogOutIcon } from "lucide-react";
import type { ActiveSession } from "../api/sessions";
import { useLogoutDevice } from "../api/use-sessions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ActiveSessionsListProps {
  sessions: ActiveSession[];
  onAfterRevoke?: () => void;
}

export function ActiveSessionsList({ sessions, onAfterRevoke }: ActiveSessionsListProps) {
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
              <Icon className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium flex items-center gap-2">
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
                  <div className="text-xs text-muted-foreground/70 mt-0.5">
                    {session.ipAddress}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={logoutDevice.isPending}
              onClick={async () => {
                await logoutDevice.mutateAsync(session.id);
                onAfterRevoke?.();
              }}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        );
      })}
    </div>
  );
}
