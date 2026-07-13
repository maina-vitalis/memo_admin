"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useMyInstitution,
  useUpdateMyInstitution,
} from "@/features/tenant-admin/settings/api/use-institution-profile";
import {
  institutionProfileSchema,
  type InstitutionProfileFormValues,
} from "@/features/tenant-admin/settings/schemas/institution-profile.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function InstitutionProfileForm() {
  const { data: institution, isLoading, isError, error } = useMyInstitution();
  const updateInstitution = useUpdateMyInstitution();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<InstitutionProfileFormValues>({
    resolver: zodResolver(institutionProfileSchema),
    defaultValues: { name: "", contactEmail: "", logoUrl: "", timezone: "" },
  });

  useEffect(() => {
    if (institution) {
      reset({
        name: institution.name,
        contactEmail: institution.contactEmail,
        logoUrl: institution.logoUrl ?? "",
        timezone: institution.timezone,
      });
    }
  }, [institution, reset]);

  async function onSubmit(values: InstitutionProfileFormValues) {
    try {
      await updateInstitution.mutateAsync({
        name: values.name,
        contactEmail: values.contactEmail,
        logoUrl: values.logoUrl ?? "",
        timezone: values.timezone,
      });
      toast.success("Institution profile updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update institution profile",
      );
    }
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "Failed to load institution profile."}
      </p>
    );
  }

  return (
    <Card className="max-w-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Institution profile</CardTitle>
        <CardDescription>
          This information is shown across TVET MEMO and to your institution&apos;s
          members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="institution-name">Institution name</FieldLabel>
              <Input
                id="institution-name"
                disabled={isLoading}
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field data-invalid={!!errors.contactEmail}>
              <FieldLabel htmlFor="institution-contact-email">
                Contact email
              </FieldLabel>
              <Input
                id="institution-contact-email"
                type="email"
                disabled={isLoading}
                aria-invalid={!!errors.contactEmail}
                {...register("contactEmail")}
              />
              <FieldError errors={[errors.contactEmail]} />
            </Field>

            <Field data-invalid={!!errors.logoUrl}>
              <FieldLabel htmlFor="institution-logo-url">Logo URL</FieldLabel>
              <Input
                id="institution-logo-url"
                placeholder="https://..."
                disabled={isLoading}
                aria-invalid={!!errors.logoUrl}
                {...register("logoUrl")}
              />
              <FieldError errors={[errors.logoUrl]} />
            </Field>

            <Field data-invalid={!!errors.timezone}>
              <FieldLabel htmlFor="institution-timezone">Timezone</FieldLabel>
              <Input
                id="institution-timezone"
                placeholder="Africa/Nairobi"
                disabled={isLoading}
                aria-invalid={!!errors.timezone}
                {...register("timezone")}
              />
              <FieldError errors={[errors.timezone]} />
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !isDirty}
              className="w-fit"
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
