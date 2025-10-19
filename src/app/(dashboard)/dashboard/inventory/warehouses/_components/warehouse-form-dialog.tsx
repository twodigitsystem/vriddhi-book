"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createWarehouse, updateWarehouse } from "../_actions/warehouse";
import { warehouseFormSchema, type WarehouseFormInput } from "../_schemas/warehouse.schema";
import { Warehouse } from "../_types/types.warehouse";
import { Loader2 } from "lucide-react";

interface WarehouseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
  organizationId: string;
  onSuccess: () => void;
}

export function WarehouseFormDialog({
  isOpen,
  onClose,
  warehouse,
  organizationId,
  onSuccess,
}: WarehouseFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!warehouse;

  const form = useForm<WarehouseFormInput>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  // Reset form when dialog opens/closes or warehouse changes
  useEffect(() => {
    if (isOpen) {
      if (warehouse) {
        form.reset({
          name: warehouse.name,
          address: warehouse.address,
        });
      } else {
        form.reset({
          name: "",
          address: "",
        });
      }
    }
  }, [isOpen, warehouse, form]);

  const onSubmit = async (data: WarehouseFormInput) => {
    setIsSubmitting(true);
    try {
      let result;

      if (isEditing && warehouse) {
        result = await updateWarehouse({
          id: warehouse.id,
          ...data,
        });
      } else {
        result = await createWarehouse(data);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? "Warehouse updated successfully"
            : "Warehouse created successfully"
        );
        onSuccess();
        onClose();
        form.reset();
      } else {
        toast.error(result.error || "Failed to save warehouse");
      }
    } catch (error) {
      console.error("Error submitting warehouse form:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Warehouse" : "Add New Warehouse"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the warehouse details below."
              : "Create a new warehouse location for inventory management."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Warehouse Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Main Warehouse, Store #1"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter complete warehouse address"
                      rows={4}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
