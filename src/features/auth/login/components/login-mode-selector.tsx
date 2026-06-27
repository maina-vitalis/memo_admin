"use client";

import { Building2Icon, ShieldCheckIcon } from "lucide-react";
import type { LoginMode } from "@/features/auth/login/types/login";
import { cn } from "@/lib/utils";

type LoginModeSelectorProps = {
  selected: LoginMode;
  onChange: (mode: LoginMode) => void;
};

type ModeOption = {
  mode: LoginMode;
  icon: React.ElementType;
  label: string;
  description: string;
};

const MODE_OPTIONS: ModeOption[] = [
  {
    mode: "super-admin",
    icon: ShieldCheckIcon,
    label: "Platform Admin",
    description: "Manage institutions & platform settings",
  },
  {
    mode: "institution-admin",
    icon: Building2Icon,
    label: "Institution Admin",
    description: "Access your institution's portal",
  },
];

/**
 * A pill-style tab selector that lets the user pick their login role.
 * Rendered above the credential form — switching mode clears the form.
 */
export function LoginModeSelector({ selected, onChange }: LoginModeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Select your account type"
      className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1"
    >
      {MODE_OPTIONS.map(({ mode, icon: Icon, label, description }) => {
        const isActive = selected === mode;

        return (
          <button
            key={mode}
            role="tab"
            type="button"
            id={`login-mode-tab-${mode}`}
            aria-selected={isActive}
            aria-controls={`login-mode-panel-${mode}`}
            onClick={() => onChange(mode)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-3 py-3 text-center transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
              aria-hidden
            />
            <span className="text-sm font-semibold leading-none">{label}</span>
            <span className="text-[11px] leading-tight">{description}</span>
          </button>
        );
      })}
    </div>
  );
}
