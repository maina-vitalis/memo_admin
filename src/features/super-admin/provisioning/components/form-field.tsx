import type { FieldError as RHFFieldError } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type FormFieldProps = {
  label: string;
  description?: string;
  error?: RHFFieldError;
  children: React.ReactNode;
  htmlFor?: string;
};

export function FormField({
  label,
  description,
  error,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldContent>
        <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
        {children}
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        <FieldError errors={error ? [error] : undefined} />
      </FieldContent>
    </Field>
  );
}
