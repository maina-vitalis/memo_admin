import type { Institution } from "@/lib/types";

const planStyles: Record<Institution["plan"], string> = {
  trial: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  basic: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  pro: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
};

export function InstitutionTable({
  institutions,
}: {
  institutions: Institution[];
}) {
  if (institutions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
        <p className="text-lg font-medium text-white">No institutions yet</p>
        <p className="mt-2 text-sm text-slate-400">
          Use Provision new to onboard your first school.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
      <table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-900/80">
          <tr>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Institution
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Subdomain
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Plan
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Contact
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {institutions.map((institution) => (
            <tr key={institution.id} className="hover:bg-slate-900/70">
              <td className="px-5 py-4 text-sm font-medium text-white">
                {institution.name}
              </td>
              <td className="px-5 py-4 font-mono text-sm text-emerald-300">
                {institution.subdomain}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${planStyles[institution.plan]}`}
                >
                  {institution.plan}
                </span>
              </td>
              <td className="px-5 py-4 text-sm text-slate-300">
                {institution.contactEmail}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                    institution.isActive
                      ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30"
                      : "bg-rose-500/15 text-rose-300 ring-rose-500/30"
                  }`}
                >
                  {institution.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-5 py-4 text-sm text-slate-400">
                {new Date(institution.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
