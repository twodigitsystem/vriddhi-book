"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { upsertBrand } from "@/app/(dashboard)/dashboard/inventory/brands/_actions/brand";
import {
  BrandSchema,
  BrandSchemaType,
} from "@/app/(dashboard)/dashboard/inventory/brands/_schemas/inventory.brand.schema";

interface Brand {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

import { useOrganization } from "@/hooks/use-organization";

interface BrandFormProps {
  data?: Brand;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BrandForm({
  data,
  open,
  onOpenChange,
  onSuccess,
}: BrandFormProps) {
  const [isPending, startTransition] = useTransition();
  const { data: organizationId } = useOrganization();

  const form = useForm<BrandSchemaType>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        id: data?.id,
        name: data?.name || "",
        description: data?.description || "",
      });
    }
  }, [open, data, form]);

  const onSubmit = (values: BrandSchemaType) => {
    if (!organizationId) {
      toast.error("Organization not found. Please select an organization.");
      return;
    }
    startTransition(async () => {
      try {
        const result = await upsertBrand({
          ...values,
          id: values.id || data?.id,
          organizationId,
        });
        if (result.success) {
          toast.success(
            data ? "Brand updated successfully!" : "Brand created successfully!",
          );
          form.reset();
          onSuccess?.();
          onOpenChange(false);
        } else {
          toast.error(result.error || "Failed to save brand");
        }
      } catch (error) {
        console.error("Brand operation failed:", error);
        toast.error("Failed to save brand. Please try again.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Brand" : "Add Brand"}</DialogTitle>
          <DialogDescription>
            {data
              ? "Update the details of your brand."
              : "Add a new brand to your inventory."}
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
                    <Input placeholder="e.g., Apple" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short description of the brand."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : data
                    ? "Save Changes"
                    : "Create Brand"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
