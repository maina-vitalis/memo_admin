"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2Icon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLogin } from "@/features/auth/api/use-login";
import {
  institutionAdminLoginSchema,
  type InstitutionAdminLoginFormValues,
} from "@/features/auth/login/schemas/login.schema";
import { getPostLoginPath } from "@/features/auth/types";
import { tenantApiConfig } from "@/features/tenant-admin/shared/api/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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

type InstitutionAdminLoginFormProps = {
  /** Pre-fill the subdomain field — used when coming from a deep link. */
  defaultSubdomain?: string;
};

/**
 * Credential form rendered when the user selects the "Institution Admin" login mode.
 * Collects subdomain + email + password.
 *
 * First-time institution admins should use the setup link from their invitation email
 * before attempting to log in here.
 */
export function InstitutionAdminLoginForm({
  defaultSubdomain = "",
}: InstitutionAdminLoginFormProps) {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InstitutionAdminLoginFormValues>({
    resolver: zodResolver(institutionAdminLoginSchema),
    defaultValues: {
      institutionSubdomain: defaultSubdomain,
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: InstitutionAdminLoginFormValues) {
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
        institutionSubdomain: values.institutionSubdomain,
      });

      toast.success("Signed in successfully");
      router.replace(getPostLoginPath(result.role));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign in";
      setError("root", { message });
    }
  }

  return (
    <form
      id="institution-admin-login-form"
      aria-label="Institution admin sign in"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        {tenantApiConfig.useMock ? (
          <Alert>
            <AlertDescription>
              API URL is not configured — mock sign-in is active. Set{" "}
              <code className="font-mono text-xs">NEXT_PUBLIC_API_URL</code> to
              connect to the backend.
            </AlertDescription>
          </Alert>
        ) : null}

        <Field data-invalid={!!errors.institutionSubdomain}>
          <FieldLabel htmlFor="ia-subdomain">Institution subdomain</FieldLabel>
          <InputGroup className="h-10">
            <InputGroupAddon>
              <Building2Icon />
            </InputGroupAddon>
            <InputGroupInput
              id="ia-subdomain"
              autoComplete="off"
              placeholder="e.g. eldoret-polytechnic"
              aria-invalid={!!errors.institutionSubdomain}
              {...register("institutionSubdomain")}
            />
          </InputGroup>
          <FieldDescription>
            Your institution's unique identifier provided in the welcome email.
          </FieldDescription>
          <FieldError errors={[errors.institutionSubdomain]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="ia-email">Email address</FieldLabel>
          <InputGroup className="h-10">
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="ia-email"
              type="email"
              autoComplete="email"
              placeholder="admin@institution.edu"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </InputGroup>
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="ia-password">Password</FieldLabel>
            <Link
              href="#"
              tabIndex={-1}
              className="text-xs font-medium text-primary-container hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <InputGroup className="h-10">
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="ia-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
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
          <FieldError errors={[errors.password]} />
        </Field>

        {errors.root?.message ? (
          <FieldError>{errors.root.message}</FieldError>
        ) : null}

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          id="ia-submit-btn"
          className="mt-2 w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Spinner />
              Signing in...
            </>
          ) : (
            "Sign In to Institution Portal"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
