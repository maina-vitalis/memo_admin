"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectAuthHydrated,
  selectIsSuperAdminAuthenticated,
} from "@/features/auth/store/auth-selectors";
import { superAdminConfig } from "@/features/super-admin/shared/config";
import { Spinner } from "@/components/ui/spinner";

type SuperAdminAuthGuardProps = {
  children: React.ReactNode;
};

export function SuperAdminAuthGuard({ children }: SuperAdminAuthGuardProps) {
  const router = useRouter();
  const hydrated = useAppSelector(selectAuthHydrated);
  const isAuthenticated = useAppSelector(selectIsSuperAdminAuthenticated);
  const useMock = superAdminConfig.useMock;

  useEffect(() => {
    if (!hydrated) return;

    if (useMock) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router, useMock]);

  if (!hydrated || (!useMock && !isAuthenticated)) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  return children;
}
