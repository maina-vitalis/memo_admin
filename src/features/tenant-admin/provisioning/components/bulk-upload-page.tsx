"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { BulkUploadForm } from "@/features/tenant-admin/provisioning/components/bulk-upload-form";
import { Button } from "@/components/ui/button";

export function BulkUploadPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/directory">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Bulk upload students
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create many student accounts at once from an Excel roster.
          </p>
        </div>
      </div>

      <BulkUploadForm />
    </div>
  );
}
