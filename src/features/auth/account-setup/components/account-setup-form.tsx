"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleIcon, EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCompleteAccountSetup } from "@/features/auth/account-setup/api/use-complete-account-setup";
import {
  accountSetupSchema,
  type AccountSetupFormValues,
} from "@/features/auth/account-setup/schemas/account-setup.schema";
import type { SetupTokenDetails } from "@/features/auth/account-setup/types/account-setup";
import { getPostLoginPath } from "@/features/auth/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

const PLATFORM_NAME = "TVET MEMO";

type AccountSetupFormProps = {
  token: string;
  details: SetupTokenDetails;
};

/**
 * Password creation form shown after a setup token is verified.
 *
 * On successful submission:
 * - The backend sets the password, marks the token as used, and returns a JWT.
 * - The JWT is applied to the Redux store (auto-login).
 * - The user is redirected to their institution admin dashboard (/admin).
 */
export function AccountSetupForm({ token, details }: AccountSetupFormProps) {
  const router = useRouter();
  const completeSetup = useCompleteAccountSetup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccountSetupFormValues>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: AccountSetupFormValues) {
    try {
      const result = await completeSetup.mutateAsync({
        token,
        password: values.password,
      });

      toast.success(
        `Welcome, ${details.adminName}! Your account is ready.`,
      );

      // The backend auto-logs in the user — redirect straight to the dashboard.
      router.replace(getPostLoginPath(result.role));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to complete account setup";

      setError("root", { message });
      toast.error(message);
    }
  }

  return (
    <Card className="w-full max-w-[440px] rounded-xl border-border/80 shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.08),0px_2px_4px_-2px_rgba(0,0,0,0.04)]">
      <CardContent className="pt-8">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src="/logo/icon.png"
            alt="TVET MEMO"
            className="mb-3 size-12"
          />
          <h1 className="mb-3 text-[32px] leading-10 font-semibold tracking-tight text-primary-container">
            {PLATFORM_NAME}
          </h1>
          <h2 className="mb-1 text-xl leading-7 font-semibold text-foreground">
            Set up your admin account
          </h2>
          <p className="text-sm leading-5 text-muted-foreground">
            Create a password to activate your account at{" "}
            <span className="font-medium text-foreground">
              {details.institutionName}
            </span>
            .
          </p>
        </div>

        {/* Identity summary card */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
          <CheckCircleIcon
            className="mt-0.5 size-4 shrink-0 text-green-600"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="font-medium text-foreground">{details.adminName}</p>
            <p className="truncate text-muted-foreground">{details.adminEmail}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Subdomain:{" "}
              <code className="font-mono">{details.subdomain}</code>
            </p>
          </div>
        </div>

        {/* Password form */}
        <form
          id="account-setup-form"
          aria-label="Account setup — create password"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="setup-password">New password</FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="setup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                At least 8 characters with uppercase, lowercase, and a number.
              </FieldDescription>
              <FieldError errors={[errors.password]} />
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="setup-confirm-password">
                Confirm password
              </FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="setup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[errors.confirmPassword]} />
            </Field>

            {errors.root?.message ? (
              <FieldError>{errors.root.message}</FieldError>
            ) : null}

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              id="setup-submit-btn"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Activating account…
                </>
              ) : (
                "Activate My Account"
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
