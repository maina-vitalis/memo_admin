"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { selectAuthUser } from "@/features/auth/store/auth-selectors";
import {
  useMyProfile,
  useUpdateMyProfile,
} from "@/features/super-admin/settings/api/use-profile";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/features/super-admin/settings/schemas/profile.schema";
import { useAppSelector } from "@/store/hooks";
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

export function ProfileForm() {
  const authUser = useAppSelector(selectAuthUser);
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateMyProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: authUser.firstName ?? "",
      lastName: authUser.lastName ?? "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber ?? "",
      });
    }
  }, [profile, reset]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfile.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber ?? "",
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  }

  return (
    <Card className="max-w-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your platform administrator identity.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor="profile-first-name">First name</FieldLabel>
                <Input
                  id="profile-first-name"
                  disabled={isLoading}
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
                <FieldError errors={[errors.firstName]} />
              </Field>

              <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor="profile-last-name">Last name</FieldLabel>
                <Input
                  id="profile-last-name"
                  disabled={isLoading}
                  aria-invalid={!!errors.lastName}
                  {...register("lastName")}
                />
                <FieldError errors={[errors.lastName]} />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <Input id="profile-email" value={authUser.email ?? ""} disabled readOnly />
            </Field>

            <Field data-invalid={!!errors.phoneNumber}>
              <FieldLabel htmlFor="profile-phone">Phone number</FieldLabel>
              <Input
                id="profile-phone"
                placeholder="Optional"
                disabled={isLoading}
                aria-invalid={!!errors.phoneNumber}
                {...register("phoneNumber")}
              />
              <FieldError errors={[errors.phoneNumber]} />
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
