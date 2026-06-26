import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export function ProvisionTenantHeader() {
  return (
    <div className="space-y-2">
      <Link
        href="/super-admin"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Back to Tenant Directory
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Provision New TVET
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register a new institution and assign its initial subscription plan.
        </p>
      </div>
    </div>
  );
}
