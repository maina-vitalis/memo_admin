import { ProvisionTenantForm } from "@/features/super-admin/provisioning/components/provision-tenant-form";
import { ProvisionTenantHeader } from "@/features/super-admin/provisioning/components/provision-tenant-header";

export function ProvisionTenantPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <ProvisionTenantHeader />
      <ProvisionTenantForm />
    </div>
  );
}
