"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectAuthHydrated,
  selectAuthRole,
  selectIsSuperAdminAuthenticated,
} from "@/features/auth/store/auth-selectors";
import { getPostLoginPath } from "@/features/auth/types";
import { Role } from "@/lib/rbac/role.enum";
import { Spinner } from "@/components/ui/spinner";

type SuperAdminAuthGuardProps = {
  children: React.ReactNode;
};

/** [AUTH] Protects /super-admin routes — requires SUPER_ADMIN role. */
export function SuperAdminAuthGuard({ children }: SuperAdminAuthGuardProps) {
  const router = useRouter();
  const hydrated = useAppSelector(selectAuthHydrated);
  const role = useAppSelector(selectAuthRole);
  const isAuthenticated = useAppSelector(selectIsSuperAdminAuthenticated);

  console.log("hello maina");

  useEffect(() => {
    if (!hydrated) return;

    if (role && role !== Role.SUPER_ADMIN) {
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
