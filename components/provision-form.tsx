"use client";

import { useState } from "react";
import { provisionInstitution } from "@/lib/api";
import { slugifyInstitutionName } from "@/lib/slug";
import type { InstitutionPlan, ProvisionInstitutionResponse } from "@/lib/types";

const planOptions: { value: InstitutionPlan; label: string }[] = [
  { value: "trial", label: "Trial" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
];

export function ProvisionForm() {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainTouched, setSubdomainTouched] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [plan, setPlan] = useState<InstitutionPlan>("trial");
  const [principalFirstName, setPrincipalFirstName] = useState("");
  const [principalLastName, setPrincipalLastName] = useState("");
  const [principalEmail, setPrincipalEmail] = useState("");
  const [principalPassword, setPrincipalPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProvisionInstitutionResponse | null>(
    null,
  );

  function handleNameChange(value: string) {
    setName(value);

    if (!subdomainTouched) {
      setSubdomain(slugifyInstitutionName(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await provisionInstitution({
        name,
        subdomain,
        contactEmail,
        plan,
        principalFirstName,
        principalLastName,
        principalEmail,
        ...(principalPassword ? { principalPassword } : {}),
      });

      setResult(response);
      setName("");
      setSubdomain("");
      setSubdomainTouched(false);
      setContactEmail("");
      setPlan("trial");
      setPrincipalFirstName("");
      setPrincipalLastName("");
      setPrincipalEmail("");
      setPrincipalPassword("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to provision institution",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="grid gap-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:grid-cols-2 md:p-8"
      >
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Institution</h2>
            <p className="mt-1 text-sm text-slate-400">
              Basic tenant details for the new school.
            </p>
          </div>

          <Field label="Institution name" htmlFor="name">
            <input
              id="name"
              required
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Nairobi TVET College"
              className={inputClassName}
            />
          </Field>

          <Field label="Subdomain" htmlFor="subdomain" hint="Used for login URL">
            <div className="flex items-center gap-2">
              <input
                id="subdomain"
                required
                value={subdomain}
                onChange={(event) => {
                  setSubdomainTouched(true);
                  setSubdomain(event.target.value);
                }}
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                placeholder="nairobi-tvet"
                className={inputClassName}
              />
              <span className="shrink-0 text-sm text-slate-500">.memo.app</span>
            </div>
          </Field>

          <Field label="Contact email" htmlFor="contactEmail">
            <input
              id="contactEmail"
              type="email"
              required
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="info@school.ac.ke"
              className={inputClassName}
            />
          </Field>

          <Field label="Plan" htmlFor="plan">
            <select
              id="plan"
              value={plan}
              onChange={(event) =>
                setPlan(event.target.value as InstitutionPlan)
              }
              className={inputClassName}
            >
              {planOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Principal</h2>
            <p className="mt-1 text-sm text-slate-400">
              First admin user created inside the institution.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" htmlFor="principalFirstName">
              <input
                id="principalFirstName"
                required
                value={principalFirstName}
                onChange={(event) => setPrincipalFirstName(event.target.value)}
                placeholder="Jane"
                className={inputClassName}
              />
            </Field>

            <Field label="Last name" htmlFor="principalLastName">
              <input
                id="principalLastName"
                required
                value={principalLastName}
                onChange={(event) => setPrincipalLastName(event.target.value)}
                placeholder="Wanjiku"
                className={inputClassName}
              />
            </Field>
          </div>

          <Field label="Principal email" htmlFor="principalEmail">
            <input
              id="principalEmail"
              type="email"
              required
              value={principalEmail}
              onChange={(event) => setPrincipalEmail(event.target.value)}
              placeholder="principal@school.ac.ke"
              className={inputClassName}
            />
          </Field>

          <Field
            label="Temporary password (optional)"
            htmlFor="principalPassword"
            hint="Leave blank to auto-generate one"
          >
            <input
              id="principalPassword"
              type="text"
              minLength={8}
              value={principalPassword}
              onChange={(event) => setPrincipalPassword(event.target.value)}
              placeholder="Auto-generated if empty"
              className={inputClassName}
            />
          </Field>
        </section>

        <div className="md:col-span-2">
          {error ? (
            <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Provisioning..." : "Provision institution"}
          </button>
        </div>
      </form>

      {result ? <ProvisionSuccess result={result} /> : null}
    </div>
  );
}

function ProvisionSuccess({
  result,
}: {
  result: ProvisionInstitutionResponse;
}) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
      <h3 className="text-lg font-semibold text-emerald-200">
        Institution provisioned
      </h3>
      <p className="mt-2 text-sm text-emerald-100/80">
        {result.institution.name} is ready at subdomain{" "}
        <span className="font-mono">{result.institution.subdomain}</span>.
      </p>

      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-400">Principal</dt>
          <dd className="mt-1 text-white">
            {result.principal.firstName} {result.principal.lastName}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400">Principal email</dt>
          <dd className="mt-1 font-mono text-white">{result.principal.email}</dd>
        </div>
        {result.temporaryPassword ? (
          <div className="sm:col-span-2">
            <dt className="text-slate-400">Temporary password</dt>
            <dd className="mt-1 font-mono text-lg text-emerald-300">
              {result.temporaryPassword}
            </dd>
            <p className="mt-2 text-xs text-slate-400">
              Share this securely with the principal. They must change it on
              first login.
            </p>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

const inputClassName =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
