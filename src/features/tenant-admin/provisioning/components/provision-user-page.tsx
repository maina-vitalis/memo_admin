"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { ProvisionUserForm } from "@/features/tenant-admin/provisioning/components/provision-user-form";
import { Button } from "@/components/ui/button";

export function ProvisionUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/directory">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Provision new user
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new user to your institution with automatic credential
            generation.
          </p>
        </div>
      </div>

      <ProvisionUserForm />
    </div>
  );
}
