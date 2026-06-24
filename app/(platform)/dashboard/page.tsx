"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listInstitutions } from "@/lib/api";
import { InstitutionTable } from "@/components/institution-table";
import type { Institution } from "@/lib/types";

export default function DashboardPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInstitutions() {
      try {
        const data = await listInstitutions();
        setInstitutions(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load institutions",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadInstitutions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Institutions</h1>
          <p className="mt-1 text-sm text-slate-400">
            All schools provisioned on the platform.
          </p>
        </div>

        <Link
          href="/provision"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Provision new institution
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading institutions...</p>
      ) : error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : (
        <InstitutionTable institutions={institutions} />
      )}
    </div>
  );
}
