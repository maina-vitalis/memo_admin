"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { PlusIcon, UploadIcon } from "lucide-react";
import { useUsers } from "@/features/tenant-admin/provisioning/api/use-users";
import { DirectoryTable } from "@/features/tenant-admin/provisioning/components/directory-table";
import { DirectoryToolbar } from "@/features/tenant-admin/provisioning/components/directory-toolbar";
import {
  defaultDirectoryFilters,
  type DirectoryFilters,
} from "@/features/tenant-admin/provisioning/schemas/directory-filters.schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePermission } from "@/hooks/use-permission";
import { Permission } from "@/lib/rbac/permission.enum";

export function DirectoryPage() {
  const [filters, setFilters] = useState<DirectoryFilters>(
    defaultDirectoryFilters,
  );

  const {
    data: users,
    isLoading,
    isFetching: usersFetching,
    isError,
    error,
  } = useUsers();

  const handleFiltersChange = useCallback((next: DirectoryFilters) => {
    setFilters(next);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((current) => ({ ...current, page }));
  }, []);

  const totalUsers = users?.length ?? 0;
  const canBulkUpload = usePermission(Permission.PROVISION_USERS_BULK);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Staff & Student Directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading
              ? "Loading users..."
              : `${totalUsers} user${totalUsers === 1 ? "" : "s"} in your institution`}
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          {canBulkUpload ? (
            <Button asChild variant="outline">
              <Link href="/admin/directory/bulk-upload">
                <UploadIcon className="mr-2 h-4 w-4" />
                Bulk upload
              </Link>
            </Button>
          ) : null}
          <Button asChild>
            <Link href="/admin/directory/provision-user">
              <PlusIcon className="mr-2 h-4 w-4" />
              Provision user
            </Link>
          </Button>
        </div>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load directory</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading users."}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <DirectoryToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading directory...
              </span>
            </div>
          ) : (
            <DirectoryTable
              users={users ?? []}
              filters={filters}
              isLoading={usersFetching}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
