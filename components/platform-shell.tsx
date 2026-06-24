"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Institutions" },
  { href: "/provision", label: "Provision new" },
];

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-900/60 p-6 md:flex md:flex-col">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Memo Platform
            </p>
            <h1 className="mt-2 text-xl font-semibold text-white">
              Super Admin
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Provision and manage institutions
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 rounded-xl border border-slate-700 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
          >
            Sign out
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 md:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Platform operator
              </p>
              <p className="text-sm text-slate-300">Manual institution onboarding</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 md:hidden"
            >
              Sign out
            </button>
          </header>

          <main className="flex-1 px-6 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
