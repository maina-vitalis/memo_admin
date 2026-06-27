"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifySetupToken } from "@/features/auth/account-setup/api/use-verify-setup-token";
import { AccountSetupForm } from "@/features/auth/account-setup/components/account-setup-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * Page-level component for the /setup route.
 *
 * Flow:
 * 1. Reads `?token=` from the URL — this is the raw setup token from the welcome email.
 * 2. Calls POST /auth/setup/verify to validate the token and get institution details.
 * 3. On success → renders AccountSetupForm for the admin to set their password.
 * 4. After the form is submitted → POST /auth/setup/complete → auto-login → redirect to /admin.
 *
 * Error states:
 * - No token in URL → friendly "check your email" message.
 * - Token invalid / expired → destructive alert with link back to login.
 */
export function AccountSetupPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data, isLoading, isError, error } = useVerifySetupToken(token);

  if (!token) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <Alert>
            <AlertDescription>
              This setup link is missing a token. Check your invitation email or
              contact your platform administrator.
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline">
            <Link href="/login">Go to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8" />
          <p className="text-sm text-muted-foreground">
            Verifying your setup link…
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "This setup link is invalid or has expired. Please contact your platform administrator."}
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline">
            <Link href="/login">Go to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <AccountSetupForm token={token} details={data} />
    </div>
  );
}
