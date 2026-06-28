"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLogin } from "@/features/auth/login/api/use-login";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/login/schemas/login.schema";
import { getPostLoginPath } from "@/features/auth/types";
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
import Link from "next/link";

/**
 * Unified credential form.
 * Takes email and password, submits to an orchestrator which determines
 * if the user is a super-admin or tenant-admin automatically.
 */
export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
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
      id="login-form"
      aria-label="Sign in"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-4">
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="login-email">Email address</FieldLabel>
          <InputGroup className="h-10">
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </InputGroup>
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
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
              id="login-password"
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
          id="login-submit-btn"
          className="mt-2 w-full hover:bg-secondary/70"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Spinner />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
