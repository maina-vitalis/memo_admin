"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUpdateRole } from "@/features/tenant-admin/roles/api/use-update-role";
import type { RoleWithDetails } from "@/features/tenant-admin/roles/api/get-roles";
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
import { PencilIcon } from "lucide-react";

const updateRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name must be at least 2 characters"),
  hierarchyLevel: z
    .number({ invalid_type_error: "Hierarchy level is required" })
    .int()
    .min(1, "Minimum level is 1")
    .max(8, "Maximum level is 8"),
});

type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;

interface EditRoleDialogProps {
  role: RoleWithDetails;
}

export function EditRoleDialog({ role }: EditRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const updateRoleMutation = useUpdateRole();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: role.name,
      hierarchyLevel: role.hierarchyLevel,
    },
  });

  async function onSubmit(values: UpdateRoleFormValues) {
    try {
      await updateRoleMutation.mutateAsync({
        roleId: role.id,
        data: {
          name: values.name,
          hierarchyLevel: values.hierarchyLevel,
        },
      });

      toast.success(`Role "${values.name}" updated successfully`);
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update role";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the role name and hierarchy level.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Role Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Student, Teacher, Principal"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hierarchyLevel">
              Hierarchy Level <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hierarchyLevel"
              type="number"
              min={1}
              max={8}
              placeholder="1-8 (1 = highest authority)"
              aria-invalid={!!errors.hierarchyLevel}
              {...register("hierarchyLevel", { valueAsNumber: true })}
            />
            {errors.hierarchyLevel && (
              <p className="text-sm text-destructive">
                {errors.hierarchyLevel.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Lower numbers = higher authority (e.g., 1 = Admin, 8 = Student)
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={updateRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? (
                <>
                  <Spinner />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
