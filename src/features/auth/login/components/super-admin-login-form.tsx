"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLogin } from "@/features/auth/api/use-login";
import {
  superAdminLoginSchema,
  type SuperAdminLoginFormValues,
} from "@/features/auth/login/schemas/login.schema";
import { getPostLoginPath } from "@/features/auth/types";
import { superAdminConfig } from "@/features/super-admin/shared/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
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

/**
 * Credential form rendered when the user selects the "Platform Admin" login mode.
 * Only requests email and password — no institution subdomain needed.
 */
export function SuperAdminLoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SuperAdminLoginFormValues>({
    resolver: zodResolver(superAdminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SuperAdminLoginFormValues) {
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
        // No institutionSubdomain → triggers super-admin login path
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
      id="super-admin-login-form"
      aria-label="Platform admin sign in"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        {superAdminConfig.useMock ? (
          <Alert>
            <AlertDescription>
              API URL is not configured — mock sign-in is active. Set{" "}
              <code className="font-mono text-xs">NEXT_PUBLIC_API_URL</code> to
              connect to the backend.
            </AlertDescription>
          </Alert>
        ) : null}

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="sa-email">Email address</FieldLabel>
          <InputGroup className="h-10">
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="sa-email"
              type="email"
              autoComplete="email"
              placeholder="platform@admin.example"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </InputGroup>
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="sa-password">Password</FieldLabel>
          <InputGroup className="h-10">
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="sa-password"
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
          id="sa-submit-btn"
          className="mt-2 w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Spinner />
              Signing in...
            </>
          ) : (
            "Sign In as Platform Admin"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
