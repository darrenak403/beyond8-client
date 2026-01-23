'use client';

import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Form Field Wrapper Component
interface FormFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  as?: 'input' | 'textarea';
  className?: string;
  rows?: number;
  disabled?: boolean;
  max?: string;
}

export function FormikField({
  name,
  label,
  type = 'text',
  placeholder,
  as = 'input',
  className,
  rows,
  disabled,
  max,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Field name={name}>
        {({ field, meta }: { field: Record<string, unknown>; meta: { touched: boolean; error?: string } }) => (
          <>
            {as === 'textarea' ? (
              <Textarea
                {...field}
                id={name}
                placeholder={placeholder}
                className={cn(
                  meta.touched && meta.error && 'border-destructive focus-visible:ring-destructive',
                  className
                )}
                rows={rows}
                disabled={disabled}
              />
            ) : (
              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                className={cn(
                  meta.touched && meta.error && 'border-destructive focus-visible:ring-destructive',
                  className
                )}
                disabled={disabled}
                max={max}
              />
            )}
          </>
        )}
      </Field>
      <ErrorMessage name={name}>
        {(msg) => <p className="text-[0.8rem] font-medium text-destructive">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

// Form Container Component
interface FormikFormProps<T extends Record<string, unknown>> {
  initialValues: T;
  validationSchema: Yup.AnyObjectSchema;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<void>;
  children: ReactNode | ((props: FormikProps<T>) => ReactNode);
  className?: string;
}

export function FormikForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  className,
}: FormikFormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {(formikProps) => (
        <Form className={cn('space-y-4', className)}>
          {typeof children === 'function' ? children(formikProps) : children}
        </Form>
      )}
    </Formik>
  );
}

// Export Yup for validation schemas
export { Yup };
