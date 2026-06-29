"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { useCreateDepartment } from "@/features/tenant-admin/departments/api/use-create-department";
import { useInstitutionUsers } from "@/features/tenant-admin/roles/api/use-users";
import {
  createDepartmentSchema,
  defaultCreateDepartmentValues,
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

export function CreateDepartmentDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateDepartment();
  const { data: users } = useInstitutionUsers();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: defaultCreateDepartmentValues,
  });

  async function onSubmit(values: CreateDepartmentFormValues) {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        code: values.code?.trim() || undefined,
        headUserId: values.headUserId || undefined,
      });

      toast.success(`Department "${values.name}" created successfully`);
      reset(defaultCreateDepartmentValues);
      setOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create department";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create department
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create department</DialogTitle>
          <DialogDescription>
            Add an academic unit to your institution. Department names must be
            unique.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dept-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dept-name"
              placeholder="e.g. Information Communication Technology"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-code">Code</Label>
            <Input
              id="dept-code"
              placeholder="e.g. ICT"
              aria-invalid={!!errors.code}
              {...register("code")}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Short identifier used in reports and dropdowns.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-head">Department head</Label>
            <Controller
              name="headUserId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <SelectTrigger id="dept-head" className="w-full">
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
            {errors.headUserId && (
              <p className="text-sm text-destructive">
                {errors.headUserId.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset(defaultCreateDepartmentValues);
              }}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                "Create department"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
