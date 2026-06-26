"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useProvisionTenant } from "@/features/super-admin/provisioning/api/use-provision-tenant";
import { ProvisionAdminFields } from "@/features/super-admin/provisioning/components/provision-admin-fields";
import { ProvisionInstitutionFields } from "@/features/super-admin/provisioning/components/provision-institution-fields";
import { ProvisionSubscriptionFields } from "@/features/super-admin/provisioning/components/provision-subscription-fields";
import {
  defaultProvisionTenantValues,
  provisionTenantSchema,
  type ProvisionTenantFormValues,
} from "@/features/super-admin/provisioning/schemas/provision-tenant.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

const STATUS_DEFAULT_DAYS: Record<
  ProvisionTenantFormValues["initialStatus"],
  number
> = {
  trial: 30,
  active: 365,
  pending: 14,
};

export function ProvisionTenantForm() {
  const router = useRouter();
  const provisionMutation = useProvisionTenant();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProvisionTenantFormValues>({
    resolver: zodResolver(provisionTenantSchema),
    defaultValues: defaultProvisionTenantValues,
  });

  const initialStatus = watch("initialStatus");

  useEffect(() => {
    setValue("subscriptionDays", STATUS_DEFAULT_DAYS[initialStatus]);
  }, [initialStatus, setValue]);

  async function onSubmit(values: ProvisionTenantFormValues) {
    try {
      const result = await provisionMutation.mutateAsync({
        ...values,
        provisioningNotes: values.provisioningNotes || undefined,
      });

      toast.success(`${result.name} provisioned successfully`);
      router.push("/super-admin");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to provision institution";

      setError("root", { message });
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldSet>
        <FieldGroup>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Institution details</CardTitle>
              <CardDescription>
                Identity and capacity settings for the new TVET tenant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProvisionInstitutionFields
                register={register}
                errors={errors}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Subscription plan</CardTitle>
              <CardDescription>
                Initial access status and billing period for the institution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProvisionSubscriptionFields
                control={control}
                register={register}
                errors={errors}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Administrator contact</CardTitle>
              <CardDescription>
                The first admin user who will manage this institution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProvisionAdminFields register={register} errors={errors} />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 border-t sm:flex-row sm:items-center sm:justify-between">
              {errors.root?.message ? (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              ) : (
                <FieldLegend className="mb-0 text-sm font-normal text-muted-foreground">
                  Provisioning creates the tenant and queues an admin invite.
                </FieldLegend>
              )}

              <div className="flex gap-3 sm:ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/super-admin")}
                  disabled={provisionMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={provisionMutation.isPending}>
                  {provisionMutation.isPending ? (
                    <>
                      <Spinner />
                      Provisioning...
                    </>
                  ) : (
                    "Provision institution"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
