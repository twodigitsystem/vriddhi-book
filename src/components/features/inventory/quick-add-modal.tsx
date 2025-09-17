"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
}

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  schema: z.ZodObject<any, any>;
  formFields: FormFieldConfig[];
  onSubmit: (data: any) => Promise<any>;
  onSuccess: (newData: any) => void;
}

export function QuickAddModal({ isOpen, onClose, title, schema, formFields, onSubmit, onSuccess }: QuickAddModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}),
  });

  const handleFormSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit(data);
      onSuccess(result);
      form.reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            {formFields.map((fieldConfig) => (
              <FormField
                key={fieldConfig.name}
                control={form.control}
                name={fieldConfig.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldConfig.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={fieldConfig.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
