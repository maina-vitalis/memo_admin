/**
 * [SIGN OUT ALL + ACTIVE SESSIONS] Security / Devices page
 *
 * Lightweight implementation for showing where the user is logged in.
 * - Lists active sessions
 * - "Sign out from all devices" (big red action)
 * - Per-device sign out
 *
 * Senior engineer notes:
 * - Uses React Query for data + mutations
 * - After "sign out all" we also dispatch global logout + redirect
 * - This page can be expanded later into full security settings (2FA, etc.)
 */

"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/store/auth-slice";
import { useActiveSessions, useLogoutAllDevices } from "@/features/tenant-admin/security/api/use-sessions";
import { ActiveSessionsList } from "@/features/tenant-admin/security/components/active-sessions-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { LogOutIcon } from "lucide-react";

export default function SecurityPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: sessions = [], isLoading, refetch } = useActiveSessions();
  const logoutAll = useLogoutAllDevices();

  const handleLogoutAll = async () => {
    await logoutAll.mutateAsync();
    // After server revokes everything, clear local state and force re-login
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Security</h1>
        <p className="text-muted-foreground mt-1">
          Manage where you&apos;re signed in and sign out from other devices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            These are the devices and browsers currently signed into your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner /> Loading sessions...
            </div>
          ) : (
            <ActiveSessionsList sessions={sessions} onAfterRevoke={() => refetch()} />
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Sign out everywhere</CardTitle>
          <CardDescription>
            This will immediately end your session on all devices, including this one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogoutAll}
            disabled={logoutAll.isPending || sessions.length === 0}
          >
            {logoutAll.isPending ? (
              <>
                <Spinner className="mr-2" /> Signing out...
              </>
            ) : (
              <>
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign out from all devices
              </>
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            You will need to sign in again on every device.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
