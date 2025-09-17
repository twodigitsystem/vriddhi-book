"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UnitWithConversions } from "../_types/types.units";
import { createUnitConversion } from "../_actions/unit";

const conversionSchema = z.object({
  baseUnitId: z.string().min(1, "Base unit is required"),
  secondaryUnitId: z.string().min(1, "Secondary unit is required"),
  conversionFactor: z.number().min(0.001, "Conversion factor must be greater than 0"),
});

type ConversionFormData = z.infer<typeof conversionSchema>;

interface UnitConversionDialogProps {
  children?: React.ReactNode;
  units: UnitWithConversions[];
  baseUnit?: UnitWithConversions;
  onConversionAdded?: () => void;
}

export function UnitConversionDialog({
  children,
  units,
  baseUnit,
  onConversionAdded,
}: UnitConversionDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<ConversionFormData>({
    resolver: zodResolver(conversionSchema),
    defaultValues: {
      baseUnitId: baseUnit?.id || "",
      secondaryUnitId: "",
      conversionFactor: 1,
    },
  });

  const selectedBaseUnit = units.find(u => u.id === form.watch("baseUnitId"));
  const selectedSecondaryUnit = units.find(u => u.id === form.watch("secondaryUnitId"));

  async function onSubmit(values: ConversionFormData) {
    try {
      const result = await createUnitConversion(values);
      
      if (result.success) {
        toast.success("Conversion created successfully!");
        if (onConversionAdded) {
          onConversionAdded();
        }
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to create conversion.");
      }
    } catch (error) {
      toast.error("Failed to create conversion.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Add Conversion</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Unit Conversion</DialogTitle>
          <DialogDescription>
            Define how one unit converts to another unit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select base unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name} ({unit.shortName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="secondaryUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select secondary unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units
                          .filter(unit => unit.id !== form.watch("baseUnitId"))
                          .map((unit) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name} ({unit.shortName})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Conversion Preview */}
            {selectedBaseUnit && selectedSecondaryUnit && (
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-4 text-foreground">
                    Conversion Preview
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center bg-background rounded-lg p-4 shadow-sm">
                      <div className="text-3xl font-bold text-primary">1</div>
                      <div className="text-sm font-medium text-muted-foreground mt-1">
                        {selectedBaseUnit.shortName}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground">=</div>
                    <div className="text-center bg-background rounded-lg p-4 shadow-sm">
                      <FormField
                        control={form.control}
                        name="conversionFactor"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.001"
                                min="0.001"
                                className="w-24 text-center text-3xl font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-sm font-medium text-muted-foreground mt-1">
                        {selectedSecondaryUnit.shortName}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-background/50 rounded-md">
                    <p className="text-sm font-medium text-foreground">
                      1 {selectedBaseUnit.name} = {form.watch("conversionFactor") || 0} {selectedSecondaryUnit.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Conversion"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}