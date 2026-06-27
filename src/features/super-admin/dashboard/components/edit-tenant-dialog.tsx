"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";
import { useUpdateTenant } from "@/features/super-admin/dashboard/api/use-tenants";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormField } from "@/features/super-admin/provisioning/components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

type EditTenantDialogProps = {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
};

type EditTenantFormValues = {
  name: string;
  contactEmail: string;
  seatQuota: number;
  plan: "trial" | "basic" | "pro";
  status: "trial" | "active" | "pending" | "suspended";
  isActive: "yes" | "no";
  provisioningNotes: string;
};

export function EditTenantDialog({
  tenant,
  isOpen,
  onClose,
}: EditTenantDialogProps) {
  const updateMutation = useUpdateTenant();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTenantFormValues>();

  React.useEffect(() => {
    if (tenant && isOpen) {
      reset({
        name: tenant.name,
        contactEmail: tenant.contactEmail || "",
        seatQuota: tenant.seatQuota || 0,
        plan: tenant.plan || "trial",
        status: tenant.status || "trial",
        isActive: tenant.isActive ? "yes" : "no",
        provisioningNotes: tenant.provisioningNotes || "",
      });
    }
  }, [tenant, isOpen, reset]);

  async function onSubmit(values: EditTenantFormValues) {
    if (!tenant) return;

    try {
      await updateMutation.mutateAsync({
        id: tenant.id,
        data: {
          name: values.name,
          contactEmail: values.contactEmail,
          seatQuota: values.seatQuota,
          plan: values.plan,
          status: values.status,
          isActive: values.isActive === "yes",
          provisioningNotes: values.provisioningNotes || undefined,
        },
      });

      toast.success("Institution updated successfully");
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update institution";
      toast.error(message);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Institution</DialogTitle>
          <DialogDescription>
            Modify the details of {tenant?.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Institution Name"
              error={errors.name}
              htmlFor="edit-name"
            >
              <Input
                id="edit-name"
                placeholder="Institution Name"
                {...register("name", { required: "Name is required" })}
              />
            </FormField>

            <FormField
              label="Contact Email"
              error={errors.contactEmail}
              htmlFor="edit-email"
            >
              <Input
                id="edit-email"
                type="email"
                placeholder="Contact Email"
                {...register("contactEmail", { required: "Email is required" })}
              />
            </FormField>

            <FormField
              label="Seat Quota"
              error={errors.seatQuota}
              htmlFor="edit-quota"
            >
              <Input
                id="edit-quota"
                type="number"
                placeholder="Seat Quota"
                {...register("seatQuota", {
                  required: "Seat Quota is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1" },
                })}
              />
            </FormField>

            <FormField label="Plan" error={errors.plan}>
              <Controller
                control={control}
                name="plan"
                rules={{ required: "Plan is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Status" error={errors.status}>
              <Controller
                control={control}
                name="status"
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Is Active" error={errors.isActive}>
              <Controller
                control={control}
                name="isActive"
                rules={{ required: "Is Active option is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Is active?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Provisioning Notes"
            error={errors.provisioningNotes}
            htmlFor="edit-notes"
          >
            <Textarea
              id="edit-notes"
              placeholder="Enter notes about the subscription or setup..."
              {...register("provisioningNotes")}
            />
          </FormField>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
