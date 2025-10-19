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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { taxRateSchema, TaxRateFormValues } from "../_schemas/tax.schema";
import { TaxRate, GST_PRESETS } from "../_types/types.tax";
import { createTaxRate, updateTaxRate } from "../_actions/tax";

interface TaxFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taxRate?: TaxRate | null;
  organizationId: string;
  onSuccess?: () => void;
}

export function TaxFormDialog({
  isOpen,
  onClose,
  taxRate,
  organizationId,
  onSuccess,
}: TaxFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPresets, setShowPresets] = useState(true);

  const form = useForm<TaxRateFormValues>({
    resolver: zodResolver(taxRateSchema),
    defaultValues: {
      name: "",
      rate: 0,
      cgstRate: null,
      sgstRate: null,
      igstRate: null,
      isCompositionScheme: false,
      description: "",
    },
  });

  // Load tax rate data when editing
  useEffect(() => {
    if (taxRate && isOpen) {
      form.reset({
        name: taxRate.name,
        rate: taxRate.rate,
        cgstRate: taxRate.cgstRate ?? null,
        sgstRate: taxRate.sgstRate ?? null,
        igstRate: taxRate.igstRate ?? null,
        isCompositionScheme: taxRate.isCompositionScheme,
        description: taxRate.description || "",
      });
      setShowPresets(false);
    } else if (!taxRate && isOpen) {
      form.reset();
      setShowPresets(true);
    }
  }, [taxRate, isOpen, form]);

  const onSubmit = async (data: TaxRateFormValues) => {
    setIsSubmitting(true);
    try {
      const taxRateData = {
        ...data,
        organizationId,
      };

      let result;
      if (taxRate) {
        result = await updateTaxRate({ ...taxRateData, id: taxRate.id });
      } else {
        result = await createTaxRate(taxRateData);
      }

      if (result.success) {
        toast.success(taxRate ? "Tax rate updated successfully" : "Tax rate created successfully");
        form.reset();
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to save tax rate");
      }
    } catch (error) {
      toast.error("An error occurred while saving tax rate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyGSTPreset = (preset: typeof GST_PRESETS[number]) => {
    form.setValue("name", preset.name);
    form.setValue("rate", preset.rate);
    form.setValue("cgstRate", preset.cgst);
    form.setValue("sgstRate", preset.sgst);
    form.setValue("igstRate", null);
    form.setValue("isCompositionScheme", false);
    setShowPresets(false);
  };

  const applyIGST = (preset: typeof GST_PRESETS[number]) => {
    form.setValue("name", preset.name.replace("GST", "IGST"));
    form.setValue("rate", preset.rate);
    form.setValue("igstRate", preset.rate);
    form.setValue("cgstRate", null);
    form.setValue("sgstRate", null);
    form.setValue("isCompositionScheme", false);
    setShowPresets(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 shrink-0">
          <DialogTitle>{taxRate ? "Edit Tax Rate" : "Add New Tax Rate"}</DialogTitle>
          <DialogDescription>
            {taxRate
              ? "Update tax rate details."
              : "Create a new GST tax rate for your organization."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto overflow-x-hidden px-6 py-4" style={{ maxHeight: "calc(90vh - 200px)" }}>
              <div className="space-y-6">
                {/* GST Presets - Only show when creating new */}
                {!taxRate && showPresets && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold">Quick Add GST Rates</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {GST_PRESETS.filter(p => p.rate > 0).map((preset) => (
                        <div key={preset.rate} className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => applyGSTPreset(preset)}
                          >
                            {preset.name}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => applyIGST(preset)}
                            title="Add as IGST"
                          >
                            IGST
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click a rate to quick-add, or fill the form below for custom rates.
                    </p>
                  </div>
                )}

                {/* Tax Rate Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., GST 18%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Total Rate */}
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Tax Rate (%) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="18"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        The total tax percentage (sum of CGST+SGST or IGST)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* GST Components */}
                <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                  <h3 className="text-sm font-semibold">GST Components</h3>
                  <p className="text-xs text-muted-foreground">
                    For intra-state: Use CGST + SGST (equal rates). For inter-state: Use IGST only.
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cgstRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CGST (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="50"
                              placeholder="9"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sgstRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SGST (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="50"
                              placeholder="9"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="igstRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IGST (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="18"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Composition Scheme */}
                <FormField
                  control={form.control}
                  name="isCompositionScheme"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Composition Scheme</FormLabel>
                        <FormDescription>
                          Check this if this tax rate is for composition scheme businesses
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Optional description or notes"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0 bg-background">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : taxRate ? "Update Tax Rate" : "Create Tax Rate"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
