"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectAuthHydrated,
  selectIsTenantAdminAuthenticated,
} from "@/features/auth/store/auth-selectors";
import { tenantApiConfig } from "@/features/tenant-admin/shared/api/client";
import { Spinner } from "@/components/ui/spinner";

type TenantAdminAuthGuardProps = {
  children: React.ReactNode;
};

export function TenantAdminAuthGuard({ children }: TenantAdminAuthGuardProps) {
  const router = useRouter();
  const hydrated = useAppSelector(selectAuthHydrated);
  const isAuthenticated = useAppSelector(selectIsTenantAdminAuthenticated);
  const useMock = tenantApiConfig.useMock;

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
