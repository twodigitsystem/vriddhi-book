// @ts-nocheck - React Hook Form generic type inference issues
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { hsnCodeSchema, HSNCodeFormValues } from "../_schemas/hsn.schema";
import { HSNCode } from "../_types/types.hsn";
import { createHSNCode, updateHSNCode } from "../_actions/hsn";
import { useTaxRates } from "@/hooks/use-tax-rates";

interface HSNFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hsnCode?: HSNCode | null;
  organizationId: string;
  onSuccess?: () => void;
}

export function HSNFormDialog({
  isOpen,
  onClose,
  hsnCode,
  organizationId,
  onSuccess,
}: HSNFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: taxRates = [] } = useTaxRates();

  const form = useForm<HSNCodeFormValues>({
    resolver: zodResolver(hsnCodeSchema),
    defaultValues: {
      code: "",
      description: "",
      defaultTaxRateId: null,
      isSystemCode: false,
    },
  });

  useEffect(() => {
    if (hsnCode && isOpen) {
      form.reset({
        code: hsnCode.code,
        description: hsnCode.description,
        defaultTaxRateId: hsnCode.defaultTaxRateId || null,
        isSystemCode: hsnCode.isSystemCode,
      });
    } else if (!hsnCode && isOpen) {
      form.reset();
    }
  }, [hsnCode, isOpen, form]);

  const onSubmit = async (data: HSNCodeFormValues) => {
    setIsSubmitting(true);
    try {
      const hsnCodeData = {
        ...data,
        organizationId,
      };

      let result;
      if (hsnCode) {
        result = await updateHSNCode({ ...hsnCodeData, id: hsnCode.id });
      } else {
        result = await createHSNCode(hsnCodeData);
      }

      if (result.success) {
        toast.success(hsnCode ? "HSN code updated successfully" : "HSN code created successfully");
        form.reset();
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save HSN code");
      }
    } catch (error) {
      toast.error("An error occurred while saving HSN code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{hsnCode ? "Edit HSN Code" : "Add New HSN Code"}</DialogTitle>
          <DialogDescription>
            {hsnCode
              ? "Update HSN code details."
              : "Add a new HSN/SAC code for your products or services."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN/SAC Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 8471" {...field} />
                  </FormControl>
                  <FormDescription>
                    4-8 digit HSN or SAC code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Computers and parts"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultTaxRateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Tax Rate (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // If "none" is selected, set to null
                      field.onChange(value === "none" ? null : value);
                    }}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default tax rate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {taxRates.map((taxRate) => (
                        <SelectItem key={taxRate.id} value={taxRate.id}>
                          {taxRate.name} ({taxRate.rate.toFixed(2)}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Default tax rate for items with this HSN code
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : hsnCode ? "Update HSN Code" : "Create HSN Code"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
