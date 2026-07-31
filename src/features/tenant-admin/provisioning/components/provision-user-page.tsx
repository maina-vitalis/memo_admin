"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ProvisionUserForm } from "@/features/tenant-admin/provisioning/components/provision-user-form";
import { Button } from "@/components/ui/button";

export function ProvisionUserPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/directory">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to directory
        </Link>
      </Button>

      <PageHeader
        title="Provision new user"
        description="Add a new user to your institution with automatic credential generation."
      />

      <ProvisionUserForm />
    </div>
  );
}
