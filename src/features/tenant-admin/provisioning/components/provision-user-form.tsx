"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useProvisionUser } from "@/features/tenant-admin/provisioning/api/use-provision-user";
import { useRoles } from "@/features/tenant-admin/provisioning/api/use-roles";
import { useDepartments } from "@/features/tenant-admin/provisioning/api/use-departments";
import { ProvisionUserFields } from "@/features/tenant-admin/provisioning/components/provision-user-fields";
import {
  defaultProvisionUserValues,
  provisionUserSchema,
  type ProvisionUserFormValues,
} from "@/features/tenant-admin/provisioning/schemas/provision-user.schema";
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

export function ProvisionUserForm() {
  const router = useRouter();
  const provisionMutation = useProvisionUser();
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProvisionUserFormValues>({
    resolver: zodResolver(provisionUserSchema),
    defaultValues: defaultProvisionUserValues,
  });

  async function onSubmit(values: ProvisionUserFormValues) {
    try {
      const result = await provisionMutation.mutateAsync(values);

      toast.success(
        `${result.firstName} ${result.lastName} has been provisioned. Login credentials sent to ${result.email}`,
      );
      router.push("/admin/directory");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to provision user";

      setError("root", { message });
      toast.error(message);
    }
  }

  const isLoading = rolesLoading || departmentsLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl">
      <FieldSet>
        <FieldGroup>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>User details</CardTitle>
              <CardDescription>
                Create a new user account. Login credentials will be sent via email.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading form data...
                  </span>
                </div>
              ) : (
                <ProvisionUserFields
                  control={control}
                  register={register}
                  errors={errors}
                  roles={roles ?? []}
                  departments={departments ?? []}
                />
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 border-t sm:flex-row sm:items-center sm:justify-between">
              {errors.root?.message ? (
                <p className="text-sm text-destructive">{errors.root.message}</p>
              ) : (
                <FieldLegend className="mb-0 text-sm font-normal text-muted-foreground">
                  A temporary password will be generated and sent via email.
                </FieldLegend>
              )}

              <div className="flex gap-3 sm:ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/directory")}
                  disabled={provisionMutation.isPending || isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={provisionMutation.isPending || isLoading}
                >
                  {provisionMutation.isPending ? (
                    <>
                      <Spinner />
                      Provisioning...
                    </>
                  ) : (
                    "Provision user"
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
