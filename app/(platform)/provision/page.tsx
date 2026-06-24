import { ProvisionForm } from "@/components/provision-form";

export default function ProvisionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Provision new institution
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Create the tenant, seed default roles, and set up the Principal in one
          step. Use this for demos, pilots, direct onboarding, or government
          batch rollouts.
        </p>
      </div>

      <ProvisionForm />
    </div>
  );
}
