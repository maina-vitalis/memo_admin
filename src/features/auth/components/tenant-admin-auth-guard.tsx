"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectAuthHydrated,
  selectAuthRole,
  selectIsTenantAdminAuthenticated,
} from "@/features/auth/store/auth-selectors";
import { getPostLoginPath } from "@/features/auth/types";
import { Spinner } from "@/components/ui/spinner";

type TenantAdminAuthGuardProps = {
  children: React.ReactNode;
};

export function TenantAdminAuthGuard({ children }: TenantAdminAuthGuardProps) {
  const router = useRouter();
  const hydrated = useAppSelector(selectAuthHydrated);
  const role = useAppSelector(selectAuthRole);
  const isAuthenticated = useAppSelector(selectIsTenantAdminAuthenticated);

  useEffect(() => {
    if (!hydrated) return;

    if (role === "super-admin") {
      router.replace(getPostLoginPath("super-admin"));
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
