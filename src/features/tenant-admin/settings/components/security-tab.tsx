"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/store/auth-slice";
import {
  ActiveSessionsList,
  useActiveSessions,
  useLogoutAllDevices,
} from "@/features/tenant-admin/security";
import { ChangePasswordForm } from "@/features/tenant-admin/settings/components/change-password-form";
import { useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function SecurityTab() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: sessions = [], isLoading, refetch } = useActiveSessions();
  const logoutAll = useLogoutAllDevices();

  async function handleLogoutAll() {
    await logoutAll.mutateAsync();
    dispatch(logout());
    router.push("/login");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <ChangePasswordForm />

      <Card className="shadow-sm">
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

      <Card className="border-destructive/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-destructive">Sign out everywhere</CardTitle>
          <CardDescription>
            This will immediately end your session on all devices, including this
            one.
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
        </CardContent>
      </Card>
    </div>
  );
}
