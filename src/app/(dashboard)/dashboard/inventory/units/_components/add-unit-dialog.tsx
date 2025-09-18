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
import { Input } from "@/components/ui/input";
import { upsertUnit } from "../_actions/unit";
import { Unit } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddUnitInput, addUnitSchema } from "../_schemas/inventory.unit.schema";



interface AddUnitDialogProps {
  children?: React.ReactNode;
  unit?: Unit;
  onUnitUpserted?: () => void;
}

export function AddUnitDialog({
  children,
  unit,
  onUnitUpserted,
}: AddUnitDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AddUnitInput>({
    resolver: zodResolver(addUnitSchema),
    defaultValues: {
      name: unit?.name || "",
      shortName: unit?.shortName || "",
    },
  });

  const isEditing = !!unit;

  async function onSubmit(values: AddUnitInput) {
    try {
      await upsertUnit({
        id: unit?.id,
        ...values,
      });
      toast.success(
        isEditing ? "Unit updated successfully!" : "Unit created successfully!"
      );
      if (onUnitUpserted) {
        onUnitUpserted();
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update unit." : "Failed to create unit."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Add Unit</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Unit" : "Add Unit"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your unit."
              : "Add a new unit of measurement."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Kilogram" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Unit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
