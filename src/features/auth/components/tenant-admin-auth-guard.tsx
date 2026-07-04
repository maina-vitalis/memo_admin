"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectAuthHydrated,
  selectAuthRole,
  selectIsTenantPortalAuthenticated,
} from "@/features/auth/store/auth-selectors";
import { getPostLoginPath } from "@/features/auth/types";
import { Role } from "@/lib/rbac/role.enum";
import { Spinner } from "@/components/ui/spinner";

type TenantAdminAuthGuardProps = {
  children: React.ReactNode;
};

/** [AUTH] Protects /admin routes — institution-scoped roles only. */
export function TenantAdminAuthGuard({ children }: TenantAdminAuthGuardProps) {
  const router = useRouter();
  const hydrated = useAppSelector(selectAuthHydrated);
  const role = useAppSelector(selectAuthRole);
  const isAuthenticated = useAppSelector(selectIsTenantPortalAuthenticated);

  useEffect(() => {
    if (!hydrated) return;

    if (role === Role.SUPER_ADMIN) {
      router.replace(getPostLoginPath(role));
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, role, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  return children;
}