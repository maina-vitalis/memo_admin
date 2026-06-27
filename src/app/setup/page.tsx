import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountSetupPage } from "@/features/auth/account-setup/components/account-setup-page";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Set Up Your Account — NostalQic Admin",
  description:
    "Create your password and activate your institution admin account on NostalQic.",
};

/**
 * Route: /setup?token=<rawToken>
 *
 * This page is reached when a newly provisioned institution admin clicks the
 * setup link from their welcome email. After successfully setting a password,
 * the user is redirected to their institution's admin dashboard (/admin).
 */
export default function SetupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background">
          <Spinner className="size-8" />
        </div>
      }
    >
      <AccountSetupPage />
    </Suspense>
  );
}
