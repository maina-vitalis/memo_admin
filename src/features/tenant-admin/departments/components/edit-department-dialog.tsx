"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";
import { useUpdateDepartment } from "@/features/tenant-admin/departments/api/use-update-department";
import { useInstitutionUsers } from "@/features/tenant-admin/roles/api/use-users";
import type { Department } from "@/features/tenant-admin/departments/api/get-departments";
import {
  createDepartmentSchema,
  type CreateDepartmentFormValues,
} from "@/features/tenant-admin/departments/schemas/department.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditDepartmentDialogProps {
  department: Department;
}

export function EditDepartmentDialog({ department }: EditDepartmentDialogProps) {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateDepartment();
  const { data: users } = useInstitutionUsers();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: department.name,
      code: department.code ?? "",
      headUserId: department.headUserId ?? undefined,
    },
  });

  async function onSubmit(values: CreateDepartmentFormValues) {
    try {
      await updateMutation.mutateAsync({
        departmentId: department.id,
        data: {
          name: values.name,
          code: values.code?.trim() || undefined,
          headUserId: values.headUserId || null,
        },
      });

      toast.success(`Department "${values.name}" updated successfully`);
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update department";
      toast.error(message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          reset({
            name: department.name,
            code: department.code ?? "",
            headUserId: department.headUserId ?? undefined,
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit department</DialogTitle>
          <DialogDescription>
            Update the department name, code, or head.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`edit-name-${department.id}`}>
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`edit-name-${department.id}`}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-code-${department.id}`}>Code</Label>
            <Input
              id={`edit-code-${department.id}`}
              aria-invalid={!!errors.code}
              {...register("code")}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-head-${department.id}`}>Department head</Label>
            <Controller
              name="headUserId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <SelectTrigger
                    id={`edit-head-${department.id}`}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a user (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {!users?.length ? (
                      <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                        No users available yet
                      </div>
                    ) : (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
