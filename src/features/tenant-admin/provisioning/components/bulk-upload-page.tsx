"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { BulkUploadForm } from "@/features/tenant-admin/provisioning/components/bulk-upload-form";
import { Button } from "@/components/ui/button";

export function BulkUploadPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/directory">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to directory
        </Link>
      </Button>

      <PageHeader
        title="Bulk upload students"
        description="Create many student accounts at once from an Excel roster."
      />

      <BulkUploadForm />
    </div>
  );
}
