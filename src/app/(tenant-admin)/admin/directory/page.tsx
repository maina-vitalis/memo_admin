"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function DirectoryPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Staff & Student Directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage users and access for your institution.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/directory/provision-user">
            <PlusIcon className="h-4 w-4 mr-2" />
            Provision user
          </Link>
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Full directory and bulk onboarding features — coming next.
      </p>
    </div>
  );
}
