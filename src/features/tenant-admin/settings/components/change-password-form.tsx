"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useChangeMyPassword } from "@/features/tenant-admin/settings/api/use-change-password";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/tenant-admin/settings/schemas/change-password.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

type PasswordFieldName = keyof ChangePasswordFormValues;

export function ChangePasswordForm() {
  const changePassword = useChangeMyPassword();
  const [visible, setVisible] = useState<Record<PasswordFieldName, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  function toggleVisible(field: PasswordFieldName) {
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed successfully");
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to change password";
      setError("root", { message });
      toast.error(message);
    }
  }

  const fields: Array<{
    name: PasswordFieldName;
    label: string;
    autoComplete: string;
  }> = [
    {
      name: "currentPassword",
      label: "Current password",
      autoComplete: "current-password",
    },
    { name: "newPassword", label: "New password", autoComplete: "new-password" },
    {
      name: "confirmPassword",
      label: "Confirm new password",
      autoComplete: "new-password",
    },
  ];

  return (
    <Card className="max-w-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Choose a strong password you don&apos;t use anywhere else.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            {fields.map(({ name, label, autoComplete }) => (
              <Field key={name} data-invalid={!!errors[name]}>
                <FieldLabel htmlFor={`change-password-${name}`}>{label}</FieldLabel>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <LockIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`change-password-${name}`}
                    type={visible[name] ? "text" : "password"}
                    autoComplete={autoComplete}
                    aria-invalid={!!errors[name]}
                    {...register(name)}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={visible[name] ? "Hide password" : "Show password"}
                      onClick={() => toggleVisible(name)}
                    >
                      {visible[name] ? <EyeOffIcon /> : <EyeIcon />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={[errors[name]]} />
              </Field>
            ))}

            {errors.root?.message ? <FieldError>{errors.root.message}</FieldError> : null}

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? (
                <>
                  <Spinner /> Updating...
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
