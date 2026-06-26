"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2Icon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useLogin } from "@/features/auth/api/use-login";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getPostLoginPath } from "@/features/auth/types";
import { superAdminConfig } from "@/features/super-admin/shared/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  institutionSubdomain: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      "Use lowercase letters, numbers, and hyphens only",
    ),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const PLATFORM_NAME = "NostalQic";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { hydrated, role, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      institutionSubdomain: "",
    },
  });

  useEffect(() => {
    if (!hydrated || !isAuthenticated || !role) return;
    router.replace(getPostLoginPath(role));
  }, [hydrated, isAuthenticated, role, router]);

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
        institutionSubdomain: values.institutionSubdomain || undefined,
      });

      toast.success("Signed in successfully");
      router.replace(getPostLoginPath(result.role));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign in";

      setError("root", { message });
      toast.error(message);
    }
  }

  return (
    <Card className="w-full max-w-[440px] rounded-lg border-border/80 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_2px_4px_-2px_rgba(0,0,0,0.05)]">
      <CardContent className="pt-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="mb-4 text-[32px] leading-10 font-semibold tracking-tight text-primary-container">
            {PLATFORM_NAME}
          </h1>
          <h2 className="mb-1 text-2xl leading-8 font-semibold text-foreground">
            Sign in to your portal
          </h2>
          <p className="text-sm leading-5 text-muted-foreground">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            {superAdminConfig.useMock ? (
              <Alert>
                <AlertDescription>
                  API URL is not configured. Set{" "}
                  <code className="font-mono text-xs">NEXT_PUBLIC_API_URL</code>{" "}
                  to connect to the backend. Mock sign-in is enabled.
                </AlertDescription>
              </Alert>
            ) : null}

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@institution.edu"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </InputGroup>
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.institutionSubdomain}>
              <FieldLabel htmlFor="institutionSubdomain">
                Institution subdomain
              </FieldLabel>
              <InputGroup className="h-10">
                <InputGroupAddon>
                  <Building2Icon />
                </InputGroupAddon>
                <InputGroupInput
                  id="institutionSubdomain"
                  autoComplete="off"
                  placeholder="e.g. eldoret-polytechnic"
                  aria-invalid={!!errors.institutionSubdomain}
                  {...register("institutionSubdomain")}
                />
              </InputGroup>
              <FieldDescription>
                Optional for super admins. Institution admins must enter the
                exact subdomain provisioned for their school.
              </FieldDescription>
              <FieldError errors={[errors.institutionSubdomain]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="#"
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
                  id="password"
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
                    onClick={() => setShowPassword((current) => !current)}
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
              className="mt-2 w-full"
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
      </CardContent>

      <CardFooter className="flex-col gap-0 border-t pt-6 pb-8">
        <Separator className="mb-6" />
        <p className="text-center text-sm leading-5 text-muted-foreground">
          Managing multiple institutions?
          <br />
          <Link
            href="#"
            className="font-medium text-primary-container hover:text-primary hover:underline"
          >
            Contact your Super Admin.
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
