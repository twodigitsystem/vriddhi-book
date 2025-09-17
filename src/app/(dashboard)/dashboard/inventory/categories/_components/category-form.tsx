"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

import { upsertCategory } from "../../_actions/category";
import {
  CreateCategoryFormValues,
  CreateCategorySchema,
} from "../_schemas/inventory.category.schema";
import { Category } from "@prisma/client";

type CategoryWithoutRelations = Omit<Category, 'items'>;
import { useEffect } from "react";

interface CategoryFormProps {
  data?: CategoryWithoutRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CategoryForm({
  data,
  open,
  onOpenChange,
  onSuccess,
}: CategoryFormProps) {
  const isEditing = !!data;

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: data?.name || "",
        description: data?.description || "",
      });
    }
  }, [open, data, form]);

  async function onSubmit(values: CreateCategoryFormValues) {
    try {
      await upsertCategory({
        id: data?.id,
        ...values,
      });
      toast.success(
        isEditing
          ? "Category updated successfully!"
          : "Category created successfully!"
      );
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Category operation failed:", error);
      toast.error(
        isEditing ? "Failed to update category." : "Failed to create category."
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your category."
              : "Add a new category to your inventory."}
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
                    <Input placeholder="e.g., Electronics" {...field} />
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
                      placeholder="A short description of the category."
                      {...field}
                    />
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
                    : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
